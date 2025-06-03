{{
  // UTILS FUNCTIONS

  // wrap un ensemble de conditions dans un opérateur logique OR ou AND
  // si une array vide de conditions est passée, on return null
  // si une seule condition est passée, par défaut on la renvoit telle quelle
  // forceWrap = true permet de forcer le wrap même si une seule condition est passée
  function wrapOperator(operator, conditions, forceWrap = false) {
    const validConditions = filterNullInArray(conditions);
    if (validConditions.length === 0) return null;
    if (validConditions.length === 1 && !forceWrap) return validConditions[0];
    return { operator, conditions: validConditions };
  }

  // wrap un ensemble de conditions dans un opérateur logique AND
  function wrapAND(conditions, forceWrap = false) {
    return wrapOperator("AND", conditions, forceWrap);
  }

  // wrap un ensemble de conditions dans un opérateur logique OR
  function wrapOR(conditions) {
    return wrapOperator("OR", conditions);
  }
  
  // wrap un ensemble de conditions dans un opérateur logique NOT
  function wrapNOT(conditions) {
  	return wrapOperator("NOT", conditions, true)
  }
  
  // clean une array d'items en retirant les null et undefined
  function filterNullInArray(items) {
  	return items.filter(t => t !== null && t !== undefined)
  }
  
  let depth = 0
}}

// une query est constituée d'une expression
Start
  = _ expr:Expr _ {
    // Si notre expression est une condition qui n'est pas un opérateur logique (AND ou OR), 
    // on la wrap seule dans un opérateur AND
    if (expr && !expr.conditions) {
      return wrapAND([expr], true)
    }

	// Sinon, notre expression est un opérateur logique (AND ou OR), on le renvoit tel quel
    return expr;
  }

// - une expression peut être vide (tout est optionnel)
// - une expression peut n'avoir qu'une seule partie (first)
// - une expression peut avoir 0,1 ou n OR qui sont chacun éventuellement 
// suivis d'une expression (rest)
//
// permet par exemple de gérer les expressions suivantes :
//
// bateau [first = bateau]
// OR bateau [rest = OR bateau]
// bateau OR [first = bateau, rest = OR]
// bateau OR port [first = bateau, rest = OR port]
// bateau OR port OR mouette océan [first = bateau, rest = OR port OR mouette océan]
Expr
  = first:ExprPart? rest:(_ OrKeyword _ ExprPart?)* {
      // chaque OR éventuellement suivi d'une expression est dans une array
      // toutes ces array (appelées restItems) sont contenues dans la variable rest
  	  // les expressions sont toutes à l'index 3 d'un restItem
      const parts = [first, ...rest.map(restItem => restItem[3])];
      return wrapOR(parts);
  }

// une partie d'expression est un ensemble de termes (1 ou n termes), wrappés
// dans un AND s'il y en a plusieurs (cf. la fonction wrapAND)
ExprPart
  = terms:Term+ { return wrapAND(terms); }

// un terme peut être : un groupe, un not, une phrase, un mot ou si aucune de
// ces structures n'a matché, un caractère superflu (DanglingChar)
Term
  = _ t:(Group / Not / Phrase / Word / DanglingChars) _ { return t; }

// un caractère superflu peut être : une parenthèse ouvrante, un wildcard, des quotes
// ou en fonction du contexte une parenthèse fermante (cf. MaybeDanglingCloseParenthesis)
// tous les caractères superflus sont retournés à null
DanglingChars = DanglingOpenParenthesis / DanglingQuote / MaybeDanglingCloseParenthesis {
	return null;
}

// si on est dans le contexte d'un groupe (depth > 0), cette règle n'est pas active. 
// les parenthèses fermantes ne sont donc pas consommées par cette règle
// si on n'est pas dans le contexte d'un groupe (depth === 0), cette règle est active.
// chaque parenthèse fermante sera donc consommée par cette règle et retournée comme null
MaybeDanglingCloseParenthesis = &{ return depth === 0; } DanglingCloseParenthesis
{ return null; }

// caractères superflus
DanglingOpenParenthesis = "("
DanglingCloseParenthesis = ")"
DanglingQuote = Quote

// si on rencontre une parenthèse ouvrante, on entre dans le contexte d'un groupe
// on augmente donc la profondeur de 1
OpenParenthesis = "(" { depth++; } 

// un groupe est constituée d'une parenthèse ouvrante, d'une expression et d'une
// parenthèse fermante
// lorsqu'un groupe a été reconnu dans la query, on considère qu'on sort du
// contexte du groupe donc on diminue la profondeur de 1
Group
  = OpenParenthesis _ expr:Expr _ ")" { 
    depth--; 
    return expr; 
  }

// un not est constitué d'un tiret suivi d'un groupe, d'une phrase ou d'un mot
Not
  = "-" _ notExpr:(Group / Phrase / Word) {
      return wrapNOT([notExpr])
  }

// une phrase est constituée de double quotes ouvrantes et fermantes contenant au moins
// un mot (pouvant contenir des wildcards et parenthèses)
// ce mot peut être suivi de 0,1 ou n mots séparés par des espaces
Phrase
  = q:Quote _ parts:(PhraseWord (RequiredSpace PhraseWord)*) _ Quote {
  	  const firstWord = parts[0]
      
      // chaque mot qui suit le premier mot est dans une array
      // toutes ces array (appelées partItem) sont contenues à l'index 1 de parts
  	  // ces mots sont tous à l'index 3 d'un partItem
      const nextWords = parts[1].map(partItem => partItem[1])
      
      // tous les mots (le premier + les suivants)
      const words = [firstWord, ...nextWords];
      
      // CLEANING - START
      
      // on ignore tous les mots qui contiennent un wildcard, sauf si le mot est 
      // uniquement un wildcard
      let cleanedWords = [...words.filter(elem => !elem.includes("*") || elem === "*")];

      // si le premier mot de la phrase est un wildcard, on le retire
      if (cleanedWords.length > 0 && cleanedWords[0] === "*") {
          cleanedWords.shift();
      }

      // si le dernier mot de la phrase est un wildcard, on le retire
      if (cleanedWords.length > 0 && cleanedWords[cleanedWords.length - 1] === "*") {
          cleanedWords.pop();
      }
      
      // CLEANING - END

	  // si après le clean on a pas de mot, on retourne null
      if (cleanedWords.length === 0) {
          return null;
      }
      
      // on associe tous les mots dans une string
      const phrase = cleanedWords.join(" ");
      
      // si la phrase a un wildCard, on est dans le contexte d'un wildCardText
      if (cleanedWords.includes("*")) {
        return { type: "wildCardText", value: phrase };
      // sinon
      } else {
        // si la phrase contient un seul mot, c'est un text
        if (cleanedWords.length === 1) {
          return { type: "text", value: phrase }
        }

		// sinon c'est un exactText
        return { type: "exactText", value: phrase };
      }
  }

// un OR correspond à la chaîne de caractère "OR" non sensible à la casse,
// qui n'est pas directement suivi par d'autres caractères simples
OrKeyword
  = "OR"i ![a-zA-Z0-9]

// un mot est un ensemble de caractères (intégrant les wildcards), qui n'est pas "OR"
// NB : le fait de gérer les wildcard ici (et pas comme un DanglingChar)
// permet d'ignorer l'ensemble du mot si ce dernier contient un wildcard
Word
  = !OrKeyword word:CharsWithWildcard {

    // si le mot contient un wildcard, on retourne null
  	if (word.includes("*")) { 
        return null;
    }

	// sinon on le retourne comme étant un text
    return { type: "text", value: word };
  }

// un mot de phrase est un ensemble de caractères (intégrant les wildcards et les parenthèses)
PhraseWord = CharsWithWildCardAndParenthesis

// 1 ou n caractères parmi ceux définis entre []
CharsWithWildcard
  = chars:[a-zA-Z0-9éèàùçôîêâû*_\.,;:?!'/@#&%+=~<>€£¥«»‹›\[\]\{\}\–—…•\^\$\|\\§±°©®™µ-]+ { return chars.join(""); }

// 1 ou n caractères parmi ceux définis entre []
CharsWithWildCardAndParenthesis
  = chars:[a-zA-Z0-9éèàùçôîêâû*\)\(_\.,;:?!'/@#&%+=~<>€£¥«»‹›\[\]\{\}\–—…•\^\$\|\\§±°©®™µ-]+ { return chars.join(""); }

Quote
  = "\"" / "\“" / "\”"

// 0,1 ou n répétitions d'un espace
_ = [ ]*

// 1 ou n répétitions d'un espace
RequiredSpace = [ ]+