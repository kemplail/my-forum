{{
  // UTILS FUNCTIONS

  function wrapAND(terms) {
    const validTerms = filterNullInArray(terms);
    if (validTerms.length === 0) return null;
    // si un seul terme est passé, on le retourne directement sans le wrapper dans un AND
    if (validTerms.length === 1) return validTerms[0];
    return { operator: "AND", conditions: validTerms };
  }
  
  function filterNullInArray(terms) {
  	return terms.filter(t => t !== null && t !== undefined)
  }
}}

Start
  = _ expr:OrExpr _ {
    // Si la recherche est vide, on renvoit un AND sans conditions
    if (!expr) {
    	return { operator: "AND", conditions: [] }
    }
    
    // Si notre expression est une seule condition qui n'est pas un opérateur logique (AND ou OR), 
    // on la wrap seule dans un opérateur AND
    if (!expr.conditions) {
      return { operator: "AND", conditions: [expr] }
    }

    return expr;
  }

OrExpr
  = first:OrPart? rest:(_ OrKeyword _ OrPart?)* {
      // il n'y a pas le premier OrPart et pas de rest
  	  if (!first && rest.length === 0) { return null }
      
      // il y a le premier OrPart mais pas de rest (ex : bateau)
      if (first && rest.length === 0) { return first; }
      
      // il y a le premier OrPart et seulement un OR (ex : bateau OR)
      if (first && rest.length === 1 && rest[0].length !== 0 && !rest[0][3]) {
      	return first;
      }
      
      // il n'y a pas le premier OrPart mais un OR avec un OrPart ensuite (ex : OR bateau)
      if (!first && rest.length === 1 && rest[0].length !== 0 && rest[0][3]) {
      	return rest[0][3];
      }
  	  
      // sinon on wrap tous les OrPart séparés d'un OR dans un opérateur OR
      return {
        operator: "OR",
        conditions: filterNullInArray([first, ...rest.map(r => r[3])])
      };
  }

OrPart
  = terms:Term+ { return wrapAND(terms); }

Term
  = _ t:(Group / Not / Phrase / Word / DanglingChars) _ { return t; }

// Caractères superflus que nous ignorons si on ne les rencontre pas dans un Term prévu
DanglingChars = DanglingOpenParenthesis / DanglingWildCard / DanglingQuote / MaybeDanglingCloseParenthesis

// On ignore les parenthèses fermantes seulement si on est en dehors d'un group (depth === 0), 
// sinon on est pas en capacité de reconnaître les Group
MaybeDanglingCloseParenthesis = &{ return options.depth === 0; } DanglingCloseParenthesis { return null; }

DanglingOpenParenthesis
  = "(" { return null; }
  
DanglingCloseParenthesis = ")" { return null; }

DanglingWildCard = "*"
 { return null; }
 
DanglingQuote
  = Quote { return null; }

// on rencontre une parenthèse ouvrante, donc on est potentiellement dans le contexte d'un group :
// on augmente en profondeur pour éviter d'ignorer les parenthèses fermantes que l'on rencontrerait (cf. MaybeDanglingCloseParenthesis)
// et qui nous permettrait de reconnaître un group
OpenParenthesis = "(" { options.depth++; } 

Group
  = OpenParenthesis _ expr:OrExpr _ ")" { 
    // cette fonction est executée lorsqu'un group en entier a été reconnu : 
    // on sort alors du group, donc on redescend en profondeur
    options.depth--; 
    return expr; 
  }

Not
  = "-" _ t:(Group / Phrase / Word) {
      return { operator: "NOT", conditions: [t] };
  }

Phrase
  = q:Quote _ parts:(SimpleWordWithWildCardAndParenthesis (RequiredSpace SimpleWordWithWildCardAndParenthesis)*) _ Quote {
  	  const firstWord = parts[0]
      const nextWords = parts[1].map(elem => elem[1])
      
      const words = [firstWord, ...nextWords];
      
      // on ignore tous les mots qui contiennent un wildcard, sauf si le mot est uniquement un wildcard
      let cleanedWords = [...words.filter(elem => !elem.includes("*") || elem === "*")];

      // si le premier mot de la phrase est un wildcard, on le retire
      if (cleanedWords.length > 0 && cleanedWords[0] === "*") {
          cleanedWords.shift();
      }

      // si le dernier mot de la phrase est un wildcard, on le retire
      if (cleanedWords.length > 0 && cleanedWords[cleanedWords.length - 1] === "*") {
          cleanedWords.pop();
      }

      if (cleanedWords.length === 0) {
          return null;
      }
      
      const phrase = cleanedWords.join(" ");
      
      if (cleanedWords.includes("*")) {
        return { type: "wildCardText", phrase };
      } else {
        if (cleanedWords.length === 1) {
          return { type: "text", phrase: cleanedWords[0] }
        }

        return { type: "exactText", phrase };
      }
  }

// !OrKeyword : permet de vérifier que le mot n'est pas un orKeyword
Word
  = !OrKeyword word:SimpleWordWithWildCard {

    // si le mot contient un wildcard, on l'ignore
  	if (word.includes("*")) { 
        return null;
    }

    return { type: "text", value: word };
  }

// i : non sensible à la casse
// ![a-zA-Z0-9] : permet d'empêcher de matcher les mots qui commencent par "or"
OrKeyword
  = "OR"i ![a-zA-Z0-9]

// 1,n caractères parmi ceux définis entre []
SimpleWordWithWildCard
  = chars:[a-zA-Z0-9éèàùçôîêâû*_\.,;:?!'/@#&%+=~<>€£¥«»‹›\[\]\{\}\–—…•\^\$\|\\§±°©®™µ-]+ { return chars.join(""); }

SimpleWordWithWildCardAndParenthesis
  = chars:[a-zA-Z0-9éèàùçôîêâû*\)\(_\.,;:?!'/@#&%+=~<>€£¥«»‹›\[\]\{\}\–—…•\^\$\|\\§±°©®™µ-]+ { return chars.join(""); }

Quote
  = "\"" / "\“" / "\”"

// 0,1,n répétitions d'un espace
_ = [ ]*

// 1,n répétitions d'un espace
RequiredSpace = [ ]+