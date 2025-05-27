
{{
  function wrapAND(terms) {
    return { operator: "AND", conditions: terms };
  }
}}

Start
  = _ expr:OrExpr _ { return expr ; }

OrExpr
  = first:AndGroup rest:(_ OrKeyword _ AndGroup)* {
      if (rest.length === 0) return first;
      return {
        operator: "OR",
        conditions: [first, ...rest.map(r => r[3])]
      };
  }

AndGroup
  = terms:Term+ { return wrapAND(terms); }

Term
  = _ t:(Group / Not / Phrase / Word) _ { return t; }

Group
  = "(" _ expr:OrExpr _ ")" { return expr; }

Not
  = "-" _ t:(Word / Phrase) {
      return { type: "exclusion", value: t.value ?? t };
  }

Phrase
  = q:Quote parts:(WordPart (RequiredSpace WordPart)*) Quote {
  	  // Le premier mot est le premier élément de l'array
  	  const firstWord = parts[0]

      // Tous les autres mots sont dans une array qui est à l'index 1
      const nextWords = parts[1].map(pair => pair[1])
      
      const words = [firstWord, ...nextWords];
      const value = words.join(" ");
      
      if (words.includes("*")) {
        // Vérification : le * ne doit pas être en début ou fin
        if (words[0] === "*" || words[words.length - 1] === "*") {
          error('The character "*" cannot appear at the beginning or end of a sentence.');
        }

        return { type: "wildCardText", value };
      } else {
        return { type: "exactText", value };
      }
  }

// !OrKeyword : permet de vérifier que le mot n'est pas un orKeyword
Word
  = !OrKeyword w:SimpleWord { return { type: "text", value: w }; }

// i : non sensible à la casse
// ![a-zA-Z0-9] : permet d'empêcher de matcher les mots qui commencent par "or"
OrKeyword
  = "OR"i ![a-zA-Z0-9]

// Mot simple ou *
WordPart
  = SimpleWord / "*"

// 1,n caractères parmi ceux définis entre []
// par défaut, renvoit chaque caractère comme élément d'une array
SimpleWord
  = chars:[a-zA-Z0-9éèàùçôîêâû_-]+ { return chars.join(""); }

Quote
  = "\""

// 0,1,n répétitions d'un espace
_ = [ ]*

RequiredSpace = [ ]+