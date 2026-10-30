// Textos e perguntas do experimento.
// Para editar o experimento, altere os textos ou os objetos de EXPERIMENT_QUESTIONS.
// O campo "field" deve corresponder a uma coluna de experiment_responses.

window.EXPERIMENT_TEXTS = {
  versionA: {
    title: "A Anonimidade nas Redes",
    paragraphs: [
      "Exigir identidade verificada nas redes sociais é uma ideia que só tende a ganhar força, e a razão é simples: ela nos devolve a responsabilidade pelo que dizemos.",
      "Pense numa conversa em qualquer praça. Ninguém sai de máscara para dizer o que pensa, e todos sabem que as palavras têm dono. Se na vida real mostramos o rosto sem constrangimento, não há razão para que na internet as regras sejam diferentes, como se ali tudo fosse permitido a quem não tem nome.",
      "Todos nós percebemos como o ódio, as ofensas e as mentiras cresceram na época em que os perfis sem nome se multiplicaram. Não pode ser coincidência: o anonimato é a causa de grande parte do pior que vemos nas redes. Quem diz a verdade não precisa se esconder. Se você não tem nada a ocultar, não há motivo para temer a identificação, e pessoas de bem sempre estiveram dispostas a assinar o que dizem. Quando sabemos quem está falando, o debate volta a ser civilizado e a mentira perde o espaço que hoje ocupa.",
      "Ou aceitamos que as redes continuem sendo um território sem lei, ou exigimos identidade de todos. Não existe meio-termo. Hoje é um comentário ofensivo; amanhã é a confiança de toda a sociedade que desaparece, e cada dia sem agir é um passo a mais nessa direção.",
      "A maioria das pessoas sensatas já pensa assim. Está na hora de as redes acompanharem o que todos já sabem e passarem a exigir que cada conta tenha um rosto e um nome verdadeiros.",
    ],
  },
  versionB: {
    title: "A Anonimidade nas Redes",
    paragraphs: [
      "Exigir identidade verificada para usar redes sociais é uma ideia defendida como remédio contra a desinformação e o assédio.Os dados disponíveis apontam em mais de uma direção.",
      "De um lado, há indícios de que o problema é real e de que o anonimato tem papel nele.Em 2018, o Facebook declarou que entre 3 % e 4 % de suas contas, cerca de 50 milhões, eram falsas, e os bots políticos costumam ser descritos por três traços: atividade, amplificação e anonimato.",
      "Do outro, há o caso da Coreia do Sul, que passou a exigir nome real nos maiores sites do país em 2007. Segundo o órgão regulador coreano, os comentários maliciosos eram 13, 9% do total naquele ano e caíram só 0, 9 ponto percentual no seguinte.Um estudo acadêmico estimou uma queda de até 30% nos xingamentos, concentrada em quem comentava pouco.Em 2012, a Corte Constitucional anulou a lei, afirmando que não havia evidência de redução dos comentários negativos e que o anonimato tem valor constitucional.Muitos usuários migraram para sites estrangeiros.",
      "Há ainda um dado que complica os dois lados: em uma amostra do Twitter durante a eleição americana de 2016, 0, 1% dos usuários compartilharam 80% das notícias falsas.Isso pode indicar que poucos perfis concentram o problema, mas não diz se identificá- los resolveria.",
      "Os estudos medem coisas diferentes, em países e épocas diferentes, e nenhum testou a exigência de identidade nas redes atuais.Por ora, os dados não permitem concluir se a verificação reduziria o problema ou criaria outros.",
    ],
  },
};

// 12 perguntas selecionadas para captar avaliação do texto, reação emocional
// e possíveis efeitos sobre a percepção de quem discorda.
// Escala: números inteiros de 0 a 10.
window.EXPERIMENT_QUESTIONS = [
  {
    field: "identity_verification_support",
    label: "O quanto você concorda que as redes sociais deveriam exigir verificação de identidade de todos os usuários?",
    lowLabel: "Discordo totalmente",
    highLabel: "Concordo totalmente",
    initialValue: 5
  },
  {
    field: "answer_certainty",
    label: "O quão certo você está da sua resposta anterior?",
    lowLabel: "Nenhuma certeza",
    highLabel: "Certeza absoluta",
    initialValue: 5
  },
  {
    field: "percentage_agreement",
    label: "Que porcentagem da sala você acha que concorda com você?",
    lowLabel: "0%",
    highLabel: "100%",
    initialValue: 5
  },
  {
    field: "disagreement_incorrectness",
    label: "O quão equivocadas estão as pessoas que discordam da sua opinião?",
    lowLabel: "Nada equivocadas",
    highLabel: "Completamente equivocadas",
    initialValue: 5
  },
  {
    field: "verification_solution",
    label: "O quanto você acha que a verificação de identidade reduziria a desinformação e os ataques nas redes?",
    lowLabel: "Não reduziria nada",
    highLabel: "Eliminaria quase totalmente",
    initialValue: 5
  },
  {
    field: "viable_alternatives",
    label: "O quanto você acha que existem alternativas viáveis à verificação de identidade para enfrentar o problema?",
    lowLabel: "Nenhuma alternativa",
    highLabel: "Muitas alternativas viáveis",
    initialValue: 5
  },
  {
    field: "decision_urgency",
    label: "O quão urgente é, na sua opinião, tomar uma decisão sobre esse tema?",
    lowLabel: "Nada urgente",
    highLabel: "Extremamente urgente",
    initialValue: 5
  },
  {
    field: "knowledge_level",
    label: "O quão bem você sente que entende sobre a verificação de identidade nas redes?",
    lowLabel: "Não entendo nada",
    highLabel: "Sei bastante do assunto",
    initialValue: 5
  },
  {
    field: "willingness_to_share",
    label: "O quão disposto você estaria a compartilhar esse texto com outras pessoas?",
    lowLabel: "Nada disposto",
    highLabel: "Muito disposto",
    initialValue: 5
  },
  {
    field: "information_need",
    label: "O quanto você sente que precisa de mais informações antes de dar uma opinião sobre o tema?",
    lowLabel: "O que tenho é suficiente",
    highLabel: "Preciso de muito mais",
    initialValue: 5
  },
  {
    field: "specialist_consensus",
    label: "O quanto você acha que os especialistas concordam entre si sobre esse tema?",
    lowLabel: "Discordam completamente",
    highLabel: "Consenso total",
    initialValue: 5
  },
  {
    field: "argument_confidence",
    label: "O quão confiante você se sentiria para explicar o tema, com argumentos, a um colega?",
    lowLabel: "Nada confiante",
    highLabel: "Totalmente confiante",
    initialValue: 5
  }
];
