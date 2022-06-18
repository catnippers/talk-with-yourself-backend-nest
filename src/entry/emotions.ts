const emotions = {
  positiveEmotions: {
      english: ["Carefree", "Bliss", "Euphoria", "Pleasure", "Delight", "I'm feeling wonderful", "Relief", "Inquisitiveness", "Proud", "Enthusiasm", "Ready for adventure", "Ready for tenderness", "I feel loving", "Gentleness", "I feel secure", "Passion", "Joy", "Willingness", "Enchantment", "Expectancy", "Relaxation", "Refreshment", "Revelation", "Composure", "Optimism", "Liveliness", "Energetic", "Hope", "Tenderness", "Exuberance", "Gladness", "Vigor", "Fullness of life", "Self-confidence", "Stimulation", "Absorbed in something", "Excitement", "Serene", "I feel moved", "I feel radiant", "Friendly", "Amusement", "Awakened", "Affection", "Heartiness", "Focused", "Fulfillment", "Calmness", "Freedom", "Happiness", "Boldness", "Trust", "Elation", "Captivation", "Satisfied", "Mindfulness", "Sensitivity", "Good mood", "In a bubbly mood", "Gratitude", "Muted", "I feel refreshed", "Emotion", "I feel absorbed in something", "Involvement", "Encouragement", "Rapture", "Curiosity", "Contentment", "Amazed", "Fascinated", "Inspired", "Interested", "Intrigued", "Surprised", "Appeased", "Kindness", "Spontaneity"],
      polish: ["Beztroska", "Błogość", "Euforia", "Przyjemność", "Rozkosz", "Czuję się wspaniale", "Ulga", "Dociekliwość", "Duma", "Entuzjazm", "Gotowość do przygód", "Gotowość do okazania czułości", "Czuję się kochający", "Łagodność", "Poczucie bezpieczeństwa", "Namiętność", "Ochoczość", "Radość", "Oczarowanie", "Oczekiwanie", "Odprężenie", "Odświeżenie", "Olśnienie", "Opanowanie", "Optymizm", "Ożywienie", "Energetyczność", "Nadzieja", "Pełnia życia", "Uradowanie", "Wigor", "Pewność siebie", "Pobudzenie", "Pochłonięty(a) czymś", "Podekscytowanie", "Titillation", "Podniecenie", "Czuję się pogodnie", "Czuję się poruszony", "Czuję się promiennie", "Przyjaźń", "Rozbawienie", "Rozbudzenie", "Rozczulenie", "Serdeczność", "Koncentracja", "Spełnienie", "Spokój", "Swoboda", "Szczęście", "Śmiałość", "Ufność", "Uniesienie", "Urzeczenie", "Satysfakcja", "Uważność", "Wrażliwość", "Dobry humor", "W szampańskim nastroju", "Wdzięczność", "Wyciszenie", "Czułość", "Wylewność", "Czuję się wypoczęty(a)", "Wzruszenie", "Czuję się czymś zaabsorbowany", "Zaangażowanie", "Zachęta", "Zachwyt", "Ciekawość", "Zadowolenie", "Zdziwiony(a)", "Zafascynowany(a)", "Zainspirowany(a)", "Zainteresowany(a)", "Zaintrygowany(a)", "Zaskoczony(a)", "Zaspokojny(a)", "Życzliwość", "Żywiołowość"]
  },
  negativeEmotions: {
      english: ["Apathy", "Sadness", "Defencelessness", "Helplessness", "Passivity", "Pain", "Blues", "Suffering", "Fury", "Anxiety", "Reluctance", "Uncertainty", "Discomfort", "Disgust", "Resistance", "I feel uncomfortable", "I feel unhappy", "I feel terrible", "Dreariness", "I feel tense", "I feel withdrawn", "I feel devastated", "I feel closed in on myself", "I have a grudge against someone", "Hostility", "Hate", "Rage", "Confusion", "Turmoil", "Jealousy", "I am sad", "Feeling guilty", "I do not care", "Disinterest", "Lack of patience", "Indolence", "Perturbation", "Distrust", "No sensitivity", "No satisfaction", "Indecision", "I feel overwhelmed", "Indifference", "Heaviness", "Numbness", "Stunned", "Weakness", "I feel lethargic", "Bewilderment", "Bitterness", "I feel apprehensive", "I feel full of doubt", "I feel full of regret", "Pessimism", "Suspiciousness", "Annoyance", "I feel blown away", "Objection", "Exhaustion", "Horror", "I feel scared", "I feel depressed", "I feel broken", "Disappointment", "Exasperation", "Anger", "Pique", "Enragement", "Lazy", "Nervous detuning", "Feeling jittery", "Enraged", "Loneliness", "Skepticism", "Somnolence", "Frustration", "Dismay", "I fell restrainted", "I feel flustered", "Longing", "Jitters", "Torment", "Panic", "I feel upset", "Outrage", "I feel lost", "Puzzlement", "I am worried about something", "Concern", "Surprise", "Sorrow", "Fear", "Shame", "Embarrassment", "I feel baffled", "Rebellion", "I feel disgusted", "Vulnerability", "Depletion", "I feel nervous", "Desperation", "I feel aloof", "I feel surprised", "Broken heart", "I feel cold", "Malice", "Fatigue", "Discouragement", "Boredom", "I feel disaffected", "Despair", "Shock"],
      polish: ["Apatia", "Smutek", "Bezradność", "Bezradność", "Bierność", "Ból", "Chandra", "Ciepienie", "Furia", "Lęk", "Niechęć", "Niepewność", "Niewygoda", "Obrzydzenie", "Opór", "Czuję się nieswojo", "Czuję się nieszczęśliwy(a)", "Czuję się okropnie", "Posępność", "Czuję się spięty(a)", "Czuję się wycofany(a)", "Czuję się załamany(a)", "Czuję się zamknięty(a) w sobie", "Czuję do kogoś urazę", "Wrogość", "Wstręt", "Wściekłość", "Zamęt", "Zamieszanie", "Zazdrość", "Jest mi przykro", "Poczucie winy", "Nic mnie nie obchodzi", "Brak zainteresowania", "Brak cierpliwości", "Niemrawość", "Niepokój", "Nieufność", "Brak wrażliwości", "Brak zadowolenia", "Niezdecydowanie", "Czuję się obezwładniony(a)", "Obojętność", "Ociężałość", "Odrętwienie", "Ogłuszenie", "Osłabienie", "Czuję się ospale", "Oszołomienie", "Gorycz", "Czuję się pełny(a) obaw", "Czuję się pełny(a) wątpliwości", "Czuję się pełny(a) żalu", "Pesymizm", "Podejrzliwość", "Nervousness", "Poddenerwowanie", "Excitement", "Podniecenie", "Poirytowanie", "Czuję się powalony(a)", "Sprzeciw", "Przemęczenie", "Przerażenie", "Czuję się przestraszony(a)", "Czuję się przybity(a)", "Czuję się rozbity(a)", "Rozczarowanie", "Rozdrażnienie", "Gniew", "Rozgoryczenie", "Rozjuszenie", "Rozleniwienie", "Rozstrojenie nerwowe", "Rozstrzęsienie", "Rozwścieczenie", "Samotność", "Sceptyzm", "Senność", "Frustracja", "Konsternacja", "Czuję się skrępowany(a)", "Czuję się speszony(a)", "Tęsknota", "Trema", "Udręka", "Panika", "Wrażliwość", "Wyczerpanie", "Czuję się wytrącony(a) z równowagi", "Wzburzenie", "Zagubienie", "Zakłopotanie", "Zamartwiam się czymś", "Zaniepokojenie", "Zaskoczenie", "Zatroskanie", "Trwoga", "Wstyd", "Zażenowanie", "Czuję się zbity(a) z tropu", "Bunt", "Czuję się zdegustowany(a)", "Czuję się zdenerwowany(a)", "Desperacja", "Czuję się zdystansowany(a)", "Czuję się zdziwiony(a)", "Złamane serce", "Czuję się zimny(a)", "Złośliwość", "Zmęczenie", "Zniechęcenie", "Nuda", "Czuję się zrażony(a)", "Rozpacz", "Szok"],
  }
};

export default emotions;