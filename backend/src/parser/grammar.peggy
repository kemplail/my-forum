{{
  function wrapAND(terms) {
    const validTerms = filterNullInArray(terms);
    if (validTerms.length === 0) return null;
    if (validTerms.length === 1) return validTerms[0];
    return { operator: "AND", conditions: validTerms };
  }
  
  function filterNullInArray(terms) {
  	return terms.filter(t => t !== null && t !== undefined)
  }
}}

Start
  = _ expr:OrExpr _ {
    if (!expr) {
    	return { operator: "AND", conditions: [] }
    }
    
    // Si notre expression est une seule condition qui n'est pas une condition logique (AND ou OR), 
    // on la wrap dans un AND
    if (!expr.conditions) {
      return { operator: "AND", conditions: [expr] }
    }

    return expr;
  }

OrExpr
  = first:AndGroup? rest:(_ OrKeyword _ AndGroup?)* {
      // il n'y a pas le premier AndGroup et pas de rest
  	  if (!first && rest.length === 0) { return null }
      
      // il y a le premier AndGroup mais pas de rest (ex : bateau)
      if (first && rest.length === 0) { return first; }
      
      // il y a le premier AndGroup et seulement un OR (ex : bateau OR)
      if (first && rest.length === 1 && rest[0].length !== 0 && !rest[0][3]) {
      	return first;
      }
      
      // il n'y a pas le premier AndGroup mais un OR avec un AndGroup ensuite (ex : OR bateau)
      if (!first && rest.length === 1 && rest[0].length !== 0 && rest[0][3]) {
      	return rest[0][3];
      }
  	  
      return {
        operator: "OR",
        conditions: filterNullInArray([first, ...rest.map(r => r[3])])
      };
  }

AndGroup
  = terms:Term+ { return wrapAND(terms); }

Term
  = _ t:(Group / Not / Phrase / Word / DanglingChars) _ { return t; }

DanglingChars = DanglingOpenParenthesis / DanglingWildCard / DanglingQuote / MaybeDanglingCloseParenthesis

MaybeDanglingCloseParenthesis = &{ return options.depth === 0; } DanglingCloseParenthesis { return null; }

DanglingOpenParenthesis
  = "(" { return null; }
  
DanglingCloseParenthesis = ")" { return null; }

DanglingWildCard = "*"
 { return null; }
 
DanglingQuote
  = Quote { return null; }

OpenParenthesis = "(" { options.depth++; } 

Group
  = OpenParenthesis _ expr:OrExpr _ ")" { options.depth--; return expr; }

Not
  = "-" _ t:(Group / Phrase / Word) {
      return { operator: "NOT", conditions: [t] };
  }

Phrase
  = q:Quote _ parts:(SimpleWordWithWildCardAndParenthesis (RequiredSpace SimpleWordWithWildCardAndParenthesis)*) _ Quote {
  	  // Le premier mot est le premier élément de l'array
  	  const firstWord = parts[0]

      // Tous les autres mots sont dans une array qui est à l'index 1
      const nextWords = parts[1].map(pair => pair[1])
      
      const words = [firstWord, ...nextWords];
      
      let cleanedWords = [...words.filter(elem => !elem.includes("*") || elem === "*")];

      if (cleanedWords.length > 0 && cleanedWords[0] === "*") {
          cleanedWords.shift();
      }

      if (cleanedWords.length > 0 && cleanedWords[cleanedWords.length - 1] === "*") {
          cleanedWords.pop();
      }

      if (cleanedWords.length === 0) {
          return null;
      }
      
      const value = cleanedWords.join(" ");
      
      if (cleanedWords.includes("*")) {
        return { type: "wildCardText", value };
      } else {
        if (cleanedWords.length === 1) {
          return { type: "text", value: cleanedWords[0] }
        }

        return { type: "exactText", value };
      }
  }

// !OrKeyword : permet de vérifier que le mot n'est pas un orKeyword
Word
  = !OrKeyword w:SimpleWordWithWildCard {
  	if (w.includes("*")) { 
        return null;
    }

    return { type: "text", value: w };
  }

// i : non sensible à la casse
// ![a-zA-Z0-9] : permet d'empêcher de matcher les mots qui commencent par "or"
OrKeyword
  = "OR"i ![a-zA-Z0-9]

// 1,n caractères parmi ceux définis entre []
// par défaut, renvoit chaque caractère comme élément d'une array
SimpleWordWithWildCard
  = chars:[a-zA-Z0-9éèàùçôîêâû*_\.,;:?!'/@#&%+=~<>€£¥«»‹›\[\]\{\}\–—…•\^\$\|\\§±°©®™µ-]+ { return chars.join(""); }

SimpleWordWithWildCardAndParenthesis
  = chars:[a-zA-Z0-9éèàùçôîêâû*\)\(_\.,;:?!'/@#&%+=~<>€£¥«»‹›\[\]\{\}\–—…•\^\$\|\\§±°©®™µ-]+ { return chars.join(""); }

Quote
  = "\"" / "\“" / "\”"

// 0,1,n répétitions d'un espace
_ = [ ]*

RequiredSpace = [ ]+