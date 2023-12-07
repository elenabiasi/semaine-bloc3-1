import Config from "./Config.js";
import Light from "./light.js";
import Speech from "speak-tts";
import EventEmitter from "@onemorestudio/eventemitterjs";
export default class Chat extends EventEmitter {
  constructor(scene) {
    super();
    this.API_URL = "https://api.openai.com/v1/chat/completions";
    this.API_KEY = Config.OPEN_AI_KEY;
    this.messages = [];
    this.light = new Light(scene);
    this.context =
      "Tu es un auteur de conte de fée qui aime les histoire mignonnes, mais qui finisse mal, avec du sang et de la tragédie. Tu ne dois pas dire qui tu es. Tu dois travailler avec moi pour écrire une histoire qui respecte les 5 étapes du schéma narratif, qui sont : la situation initiale, l’élément perturbateur, les péripéties, l’élément de résolution, la situation finale. Il faudra que tu me poses une question entre chaque étape du schéma narratif avec une question simple, qui sera juste un élément dans l'évenement que tu auras décrit en seulement 2 phrase. Le processus de notre dialogue est le suivant : tu dit 2 phrases concernant l’étape du schéma narratif dans lequel tu es puis tu me poses une question, tu attends ma réponse. Ceci 5 fois maximum.  jusqu'à que les 5 étapes soient faites, l'histoire ne doit pas être faite en plus que 5 questions. Les moments où tu racontes l'histoire ne doivent pas être plus long que 2 phrases. Tu ne devras mentionner sous aucun pretexte dans quelle étape nous sommes. Quand tu arriveras à la dernière partie de l'hisoire tu devras la terminer sans me poser de question après. Avant de commencer l'histoire tu devras me poser une question qui est « Bonjour, aide moi à inventer une histoire. Tout d’abord, qui est le personnage principal de l’histoire ?» uniquement ça, sans rien ajouter d'autre il faut que ça soit uniquement cette question. Le reste y compris l'environnement, le fait qu'il y a des sapins et des montagnes, des roches viendrons après que j'ai répondu à cette question. A chaque fois que tu me poses une question tu dois attendre ma réponse avant de continuer. Lorsque tu inventes l’histoire tu dois décrire l'environnement où se déroule l'histoire. Cet environnement devra comprendre, des sapins, des montagnes,des roches et de la neige. Et après avoir décrit l'environnement tu continueras avec la situation initiale sans coupure. Tu dois me parler comme à une perssone sans me dire que tu as compris, très bien ou autre. Je veux que la conversation se déroule comme je l'ai mentionné avant. Tu racontes l'histoire, tu poses la question, tu racontes l'histoire, etc... Et je veux que tu me poses seulement cinq questions sur toute notre discussion, c’est très importe ! À la toute fin résume TOUTE l’histoire.";
    this.speech = new Speech(); // will throw an exception if not browser supported
    if (this.speech.hasBrowserSupport()) {
      // returns a boolean
      console.log("speech synthesis supported");
    }
    this.speech
      .init({
        volume: 1,
        lang: "fr-CH",
        rate: 0.8,
        pitch: 2,
        voice: "Microsoft Guillaume - French (Switzerland)",
        //voice: "Thomas",

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
      const responseContent = data.choices[0].message.content;

      const isTargetWordPresent = this.isWordPresent(responseContent);
      this.emit("gpt_response", [responseContent]);

      if (isTargetWordPresent != "") {
        this.emit("wordFound", [isTargetWordPresent]);

        // Changez la couleur de la lumière lorsque le mot "film" est trouvé
      } else {
        console.log(
          `Le mot "${responseContent}" n'a pas été trouvé dans la réponse.`
        );
      }
      // ici on attends la réponse de CHAT GPT
      console.log(data.choices[0].message.content);

      // on peut envoyer la réponse à l'app dans l'idée de voir si on pourrait générer une image
      // this.emit("gpt_response", [data.choices[0].message.content]);
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

  isWordPresent(text) {
    if (typeof text == "string") {
      const arrayTarget = ["bonjour", "arbre", "histoire", "personnage"];

      const lowerCaseText = text.toLowerCase();

      for (let i = 0; i < arrayTarget.length; i++) {
        const isInside = lowerCaseText.includes(arrayTarget[i]);
        if (isInside) {
          return arrayTarget[i];
        }
      }
      return "";
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
