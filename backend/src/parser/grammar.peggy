{
  function wrapAND(terms) {
    if (terms.length === 1) return terms[0];
    return { operator: "AND", conditions: terms };
  }

  function isWildcardPhrase(content) {
    return content.includes("*");
  }
}

Start
  = _ expr:OrExpr _ { return expr; }

OrExpr
  = first:AndGroup rest:(_ OrKeyword _ AndGroup)+ {
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
  = "-" _ t:(Word) {
      return { type: "exclusion", value: t.value };
  }

Phrase
  = Quote parts:(WordPart (RequiredSpace WordPart)*) Quote {
      const firstWord = parts[0];
      const nextWords = parts[1].map(pair => pair[1]);
      const words = [firstWord, ...nextWords];
      const value = words.join(" ");
      
      if (words.includes("*")) {
        return { type: "wildCardText", value };
      } else {
        return { type: "exactText", value };
      }
  }

Word
  = !{ w.toUpperCase() === "OR" } w:SimpleWord { return { type: "text", value: w }; }

// "OR" comme opérateur logique : doit être exact et non suivi d'autres lettres/chiffres
OrKeyword
  = "OR"i ![a-zA-Z0-9]

// Mot simple ou *
WordPart
  = SimpleWord / "*"

SimpleWord
  = chars:[a-zA-Z0-9éèàùçôîêâû_-]+ { return chars.join(""); }

Quote
  = "\""

_ = [ ]*

RequiredSpace = [ ]+