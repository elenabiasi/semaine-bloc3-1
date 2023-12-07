import Config from "./Config.js";
import Speech from "speak-tts";
import EventEmitter from "@onemorestudio/eventemitterjs";
export default class Chat extends EventEmitter {
  constructor() {
    super();
    this.API_URL = "https://api.openai.com/v1/chat/completions";
    this.API_KEY = Config.OPEN_AI_KEY;
    this.messages = [];
    this.context =
      // "Tu es un specialiste sur la culture et l'art contemporain. Et tu me poses des questions. Basé sur mes réponses, tu me poses d'autres questions.Tu fais des question réponses très courtes et succinctes. Commence par me poser une question sur un quelconque sujet culturel.";
      // "Tu es un spécialiste sur le cinema. Et tu me poses des questions. Basé sur mes réponses, tu me poses d'autres questions. Tu fais des question réponses très courtes et succinctes. Commence par me poser une question sur un quelconque sujet cinematographique.";
      // " Tu es un auteur de conte de fée qui aime les histoire mignon, mais qui finisse mal, avec du sang et de la tragédie. ( Tu ne dois pas dire qui tu es). Tu dois travailler avec moi pour écrire une hisoire qui respecte les 5 étapes du schéma narratif, qui sont : la situation initiale, l’élément perturbateur, les péripéties, l’élément de résolution, la situation finale.Pour cela il faudra que tu me poses une question entre chaque étape, une question simple, qui sera juste un élément dans l'évènement que tu auras décrit dans la question cela devra te permette de continuer l'histoire. Donc ça sera: tu racontes l'histoires, tu me poses une questions, tu attends ma réponse, tu racontes l'hisoire, tu me poses une question,etc...  jusqu'à que les 5 étapes soient faites, l'histoire ne doit pas être faite en plus que 5 questions. Au tout début tu dois me poser cette question : A quoi ressemble ton personnage principal . Les moments où tu racontes l'histoire ne doivent pas être plus long que trois phrases. et tu ne devras mentionner sous aucun pretexte dans quelle étape nous sommes, le but étant de raconter une histoire, qui pourra être lue en continue si tu ne prend pas en compte les questions que tu me poseras. Quand tu arriveras à la dernière partie de l'hisoire tu devras la terminer sans me poser de question après. Avant de commencer l'histoire tu devras me poser la question et uniquement ça, sans rien ajouter d'autre il faut que ça soit uniquement cette question tout le reste y compris l'environnement, le fait qu'il y a des sapins et des montagnes, des roches viendrons après que j'ai répondu à la question, à quoi ressemble le personnage principale, reformule la question comme si tu étais un écrivain etAttendre que j'ai répondu à ça et ensuite tu devras décrire l'environnement ou se déroule l'histoire. Cet environnement devra comprendre, des sapins, des montagnes,des roches et de la neige. et après avoir décrit l'environnement tu continueras avec la situation initiale sans coupure. Tu dois me parler comme à une perssone sans me dire que tu as compris, très bien ou autre. Je veux que la conversation se déroule, comme je l'ai mentionné avant. Tu racontes l'hisoire, tu poses la questions, tu racontes l'histoire, etc... Encore une fois tu ne doit pas mentionner dans quelle partie nous sommes. Et je veux que tu me poses seulement cinq questions. A la toute fin résume l’histoire. ";

      // "Tu es un auteur de conte de fée qui aime les histoire mignonnes, mais qui finisse mal, avec du sang et de la tragédie. Tu ne dois pas dire qui tu es. Tu dois travailler avec moi pour écrire une histoire qui respecte les 5 étapes du schéma narratif, qui sont : la situation initiale, l’élément perturbateur, les péripéties, l’élément de résolution, la situation finale. Il faudra que tu me poses une question entre chaque étape du schéma narratif avec une question simple, qui sera juste un élément dans l'évenement que tu auras décrit en seulement 2 phrase. Le processus de notre dialogue est le suivant : tu dit 2 phrases concernant l’étape du schéma narratif dans lequel tu es puis tu me poses une question, tu attends ma réponse. Ceci 5 fois maximum.  jusqu'à que les 5 étapes soient faites, l'histoire ne doit pas être faite en plus que 5 questions. Les moments où tu racontes l'histoire ne doivent pas être plus long que 2 phrases. Tu ne devras mentionner sous aucun pretexte dans quelle étape nous sommes. Quand tu arriveras à la dernière partie de l'hisoire tu devras la terminer sans me poser de question après. Avant de commencer l'histoire tu devras me poser une question qui est « Bonjour, aide moi à inventer une histoire. Tout d’abord, qui est le personnage principal de l’histoire ?» uniquement ça, sans rien ajouter d'autre il faut que ça soit uniquement cette question. Le reste y compris l'environnement, le fait qu'il y a des sapins et des montagnes, des roches viendrons après que j'ai répondu à cette question. A chaque fois que tu me poses une question tu dois attendre ma réponse avant de continuer. Lorsque tu inventes l’histoire tu dois décrire l'environnement où se déroule l'histoire. Cet environnement devra comprendre, des sapins, des montagnes,des roches et de la neige. Et après avoir décrit l'environnement tu continueras avec la situation initiale sans coupure. Tu dois me parler comme à une perssone sans me dire que tu as compris, très bien ou autre. Je veux que la conversation se déroule comme je l'ai mentionné avant. Tu racontes l'histoire, tu poses la question, tu racontes l'histoire, etc... Et je veux que tu me poses seulement cinq questions sur toute notre discussion, c’est très importe ! À la toute fin résume TOUTE l’histoire.";

      "Tu es un auteur de conte de fée qui aime les histoire mignonnes, mais qui finisse mal, avec du sang et de la tragédie. Tu ne dois pas dire qui tu es. Tu dois travailler avec moi pour écrire une histoire. Au tout début tu dois me demander : Qui est le personnage principal ? L’histoire doit suivre les 5 étapes du schéma narratif, qui sont : 1. la situation initiale, 2. l’élément perturbateur, 3. les péripéties, 4. l’élément de résolution, 5. la situation finale. Il faudra que tu inventes une phrase de l’histoire puis que tu me poses une question entre chaque étape du schéma narratif avec une question simple, qui sera juste un élément dans l'évenement que tu auras décrit en seulement une phrase pas plus. Après chaque étape, tu dois me poser une question à laquelle je vais te répondre, tu dois arrêter de parler après avoir posé ta question obligatoirement! En fonction de ma réponse tu vas passer à la prochaine étape. Tu vas repêter ce processus pour chaque étapes du schéma narratif sauf le dernier qui est la situation finale.  Lors de notre échange tu ne dois pas pas mentionner sous aucun pretexte dans quelle étape du schéma narratif nous sommes. Dans notre échange, tu dois poser uniquement 5 questions très courte ! PAS UNE QUESTION DE PLUS S’IL TE PLAIT. L’histoire se déroule dans un environnement avec des sapins, des montagnes,des roches et de la neige. Tu dois me parler comme à une persone sans me dire que tu as compris, très bien ou autre. Pour la situation finale, tu vas finir l’histoire et dire le mot FIN et tu dois résumer toute l’histoire qu’on a inventé depuis le début et dire le mot FIN. Ces mots ne doivent jamais être mentionné : 1. la situation initiale, 2. l’élément perturbateur, 3. les péripéties, 4. l’élément de résolution, 5. la situation finale";

    this.speech = new Speech(); // will throw an exception if not browser supported
    if (this.speech.hasBrowserSupport()) {
      // returns a boolean
      console.log("speech synthesis supported");
    }
    this.speech
      .init({
        volume: 1,
        lang: "fr-FR",
        rate: 0.8,
        pitch: 2,
        // voice: "Microsoft Guillaume - French (Switzerland)",
        voice: "Thomas",

        splitSentences: true,
        listeners: {
          onvoiceschanged: (voices) => {
            console.log("Event voiceschanged", voices);
          },
        },
      })
      .then((data) => {
        // The "data" object contains the list of available voices and the voice synthesis params
        console.log("Speech is ready, voices are available", data);
        // this.speech.voice = "Eddy (anglais (États-Unis))";
      })
      .then(() => {
        console.log("Success !");
        //
        // this.call(this.context);
      })
      .catch((e) => {
        console.error("An error occured while initializing : ", e);
      });

    // this.init();
  }
  async init() {
    // on invente un contexte pour le chat
  }

  async call(userMessage) {
    this.messages.push({
      role: "user",
      content: userMessage,
    });
    console.log("config", Config.TEXT_MODEL);
    try {
      console.log("Send message to OpenAI API");
      // Fetch the response from the OpenAI API with the signal from AbortController
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          model: Config.TEXT_MODEL, // "gpt-3.5-turbo",
          messages: this.messages,
        }),
      });

      const data = await response.json();
      // ici on attends la réponse de CHAT GPT
      console.log(data.choices[0].message.content);

      // on peut envoyer la réponse à l'app dans l'idée de voir si on pourrait générer une image
      this.emit("gpt_response", [data.choices[0].message.content]);
      this.activeString = "";
      //on peut faire parler le bot
      this.speech
        .speak({
          text: data.choices[0].message.content,
          listeners: {
            onstart: () => {
              // console.log("Start utterance");
            },
            onend: () => {
              // console.log("End utterance");
            },
            onresume: () => {
              // console.log("Resume utterance");
            },
            onboundary: (event) => {
              this.extractWord(event);
            },
          },
        })
        .then(() => {
          // console.log("This is the end my friend!");
          this.emit("speechEnd", [data]);
        });
    } catch (error) {
      console.error("Error:", error);
      resultText.innerText = "Error occurred while generating.";
    }
  }

  extractWord(event) {
    const index = event.charIndex;
    const word = this.getWordAt(event.target.text, index);
    this.emit("word", [word]);
  }

  // Get the word of a string given the string and index
  getWordAt(str, pos) {
    // Perform type conversions.
    str = String(str);
    pos = Number(pos) >>> 0;

    // Search for the word's beginning and end.
    let left = str.slice(0, pos + 1).search(/\S+$/);
    let right = str.slice(pos).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
      return str.slice(left);
    }

    // Return the word, using the located bounds to extract it from the string.
    return str.slice(left, right + pos);
  }
}
