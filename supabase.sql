-- ============================================================
-- TABELA DE RESPOSTAS
-- ============================================================

-- Cria a tabela caso ainda não exista.
-- Em projetos existentes, as colunas antigas são preservadas.

create table if not exists public.experiment_responses (
  id bigint generated always as identity primary key,
  session_id text not null unique,
  condition_code text not null check (condition_code in ('A', 'B')),
  created_at timestamptz not null default now(),

  identity_verification_support integer,
  answer_certainty integer,
  percentage_agreement integer,
  disagreement_incorrectness integer,
  verification_solution integer,
  viable_alternatives integer,
  decision_urgency integer,
  knowledge_level integer,
  willingness_to_share integer,
  information_need integer,
  specialist_consensus integer,
  argument_confidence integer
);

-- Garante a existência das 12 colunas utilizadas pela versão atual.

alter table public.experiment_responses
  add column if not exists identity_verification_support integer,
  add column if not exists answer_certainty integer,
  add column if not exists percentage_agreement integer,
  add column if not exists disagreement_incorrectness integer,
  add column if not exists verification_solution integer,
  add column if not exists viable_alternatives integer,
  add column if not exists decision_urgency integer,
  add column if not exists knowledge_level integer,
  add column if not exists willingness_to_share integer,
  add column if not exists information_need integer,
  add column if not exists specialist_consensus integer,
  add column if not exists argument_confidence integer;


-- ============================================================
-- VALIDAÇÃO DA ESCALA (0–10)
-- ============================================================

-- Adiciona restrições para garantir que os valores estejam
-- dentro da escala esperada.

alter table public.experiment_responses
  add constraint experiment_responses_identity_verification_support_scale_check
    check (identity_verification_support between 0 and 10),
  add constraint experiment_responses_answer_certainty_scale_check
    check (answer_certainty between 0 and 10),
  add constraint experiment_responses_percentage_agreement_scale_check
    check (percentage_agreement between 0 and 10),
  add constraint experiment_responses_disagreement_incorrectness_scale_check
    check (disagreement_incorrectness between 0 and 10),
  add constraint experiment_responses_verification_solution_scale_check
    check (verification_solution between 0 and 10),
  add constraint experiment_responses_viable_alternatives_scale_check
    check (viable_alternatives between 0 and 10),
  add constraint experiment_responses_decision_urgency_scale_check
    check (decision_urgency between 0 and 10),
  add constraint experiment_responses_knowledge_level_scale_check
    check (knowledge_level between 0 and 10),
  add constraint experiment_responses_willingness_to_share_scale_check
    check (willingness_to_share between 0 and 10),
  add constraint experiment_responses_information_need_scale_check
    check (information_need between 0 and 10),
  add constraint experiment_responses_specialist_consensus_scale_check
    check (specialist_consensus between 0 and 10),
  add constraint experiment_responses_argument_confidence_scale_check
    check (argument_confidence between 0 and 10);


-- ============================================================
-- SEGURANÇA E PERMISSÕES
-- ============================================================

alter table public.experiment_responses enable row level security;

drop policy if exists "anonymous can submit experiment responses"
  on public.experiment_responses;

drop policy if exists "authenticated can submit experiment responses"
  on public.experiment_responses;

drop policy if exists "authenticated can read experiment responses"
  on public.experiment_responses;

revoke all on table public.experiment_responses
  from public, anon, authenticated;

grant usage on schema public to anon, authenticated;

grant insert on table public.experiment_responses
  to anon, authenticated;

create policy "anonymous can submit experiment responses"
on public.experiment_responses
for insert to anon
with check (true);

create policy "authenticated can submit experiment responses"
on public.experiment_responses
for insert to authenticated
with check (true);

grant select on table public.experiment_responses to authenticated;

create policy "authenticated can read experiment responses"
on public.experiment_responses
for select to authenticated
using (true);


-- ============================================================
-- ATRIBUIÇÃO ALTERNADA A/B
-- ============================================================

create table if not exists public.experiment_assignment_state (
  singleton boolean primary key default true check (singleton),
  last_condition text check (last_condition in ('A', 'B'))
);

insert into public.experiment_assignment_state (singleton, last_condition)
values (true, null)
on conflict (singleton) do nothing;


create table if not exists public.experiment_assignments (
  session_id text primary key,
  condition_code text not null check (condition_code in ('A', 'B')),
  created_at timestamptz not null default now()
);

alter table public.experiment_assignment_state
  enable row level security;

alter table public.experiment_assignments
  enable row level security;

revoke all on public.experiment_assignment_state
  from public, anon, authenticated;

revoke all on public.experiment_assignments
  from public, anon, authenticated;


-- ============================================================
-- FUNÇÃO DE ATRIBUIÇÃO DE CONDIÇÃO
-- ============================================================

create or replace function public.assign_experiment_condition(
  p_session_id text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  assigned_condition text;
begin
  perform 1
  from public.experiment_assignment_state
  where singleton = true
  for update;

  select condition_code
  into assigned_condition
  from public.experiment_assignments
  where session_id = p_session_id;

  if found then
    return assigned_condition;
  end if;

  update public.experiment_assignment_state
  set last_condition = case
    when last_condition = 'A' then 'B'
    else 'A'
  end
  where singleton = true
  returning last_condition into assigned_condition;

  insert into public.experiment_assignments (
    session_id,
    condition_code
  )
  values (
    p_session_id,
    assigned_condition
  );

  return assigned_condition;
end;
$$;

revoke all on function public.assign_experiment_condition(text)
  from public;

grant execute on function public.assign_experiment_condition(text)
  to anon, authenticated;


-- ============================================================
-- ATUALIZAÇÃO EM TEMPO REAL
-- ============================================================

-- Adicione experiment_responses à publicação supabase_realtime
-- pelo painel do Supabase, caso ainda não esteja habilitada.
