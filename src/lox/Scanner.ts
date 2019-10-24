// http://craftinginterpreters.com/scanning.html

import * as lox from ".";

export class Scanner {
  private source: string;
  private tokens: lox.Token[];

  constructor(source: string) {
    this.source = source;
    this.tokens = [];
  }

  public scanTokens() {
    let start: number = 0;
    let current: number = 0;
    let line: number = 1;

    const isAtEnd = () => current >= this.source.length;

    const addToken = (type: lox.TokenType, literal?: lox.ILiteral) => {
      const text = this.source.slice(start, current);
      this.tokens.push(
        new lox.Token({
          type: type,
          lexeme: text,
          literal,
          line
        })
      );
    };

    const scanToken = (): void => {
      // consumes the next character in the source file and returns it
      const advance = (): string => {
        current++;
        return this.source[current - 1];
      };
      // It’s like a conditional advance().
      // It only consumes the current character if it’s what we’re looking for.
      const match = (expected: string): boolean => {
        if (isAtEnd()) return false;
        if (this.source[current] != expected) return false;
        current++;
        return true;
      };
      // It’s sort of like advance(), but doesn’t consume the character
      const peek = (): string => {
        if (isAtEnd()) return "\0";
        return this.source[current];
      };
      const peekNext = () => {
        if (current + 1 >= this.source.length) return "\0";
        return this.source[current + 1];
      };
      const isDigit = (c: string): boolean => {
        return c >= "0" && c <= "9";
      };
      const isAlpha = (c: string): boolean => {
        return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
      };
      const isAlphaNumeric = (c: string): boolean => {
        return isAlpha(c) || isDigit(c);
      };

      const scanString = (): void => {
        while (peek() != '"' && !isAtEnd()) {
          if (peek() == "\n") line++;
          advance();
        }
        // Unterminated string.
        if (isAtEnd()) {
          lox.Lox.error(line, "Unterminated string.");
          return;
        }
        // The closing ".
        advance();
        // Trim the surrounding quotes.
        const value = this.source.slice(start + 1, current - 1);
        addToken(lox.TokenType.STRING, value);
      };

      const scanNumber = (): void => {
        while (isDigit(peek())) advance();
        // Look for a fractional part.
        if (peek() == "." && isDigit(peekNext())) {
          // Consume the "."
          advance();
          while (isDigit(peek())) advance();
        }
        addToken(
          lox.TokenType.NUMBER,
          parseFloat(this.source.slice(start, current))
        );
      };

      const scanIdentifier = (): void => {
        while (isAlphaNumeric(peek())) advance();
        // See if the identifier is a reserved word.
        const text = this.source.slice(start, current);
        const type = lox.KEYWORDS.get(text) || lox.TokenType.IDENTIFIER;
        addToken(type);
      };

      const c = advance();
      switch (c) {
        case "(": {
          addToken(lox.TokenType.LEFT_PAREN);
          break;
        }
        case ")": {
          addToken(lox.TokenType.RIGHT_PAREN);
          break;
        }
        case "{": {
          addToken(lox.TokenType.LEFT_BRACE);
          break;
        }
        case "}": {
          addToken(lox.TokenType.RIGHT_BRACE);
          break;
        }
        case ",": {
          addToken(lox.TokenType.COMMA);
          break;
        }
        case ".": {
          addToken(lox.TokenType.DOT);
          break;
        }
        case "-": {
          addToken(lox.TokenType.MINUS);
          break;
        }
        case "+": {
          addToken(lox.TokenType.PLUS);
          break;
        }
        case ";": {
          addToken(lox.TokenType.SEMICOLON);
          break;
        }
        case "*": {
          addToken(lox.TokenType.STAR);
          break;
        }
        case "!": {
          addToken(match("=") ? lox.TokenType.BANG_EQUAL : lox.TokenType.BANG);
          break;
        }
        case "=": {
          addToken(
            match("=") ? lox.TokenType.EQUAL_EQUAL : lox.TokenType.EQUAL
          );
          break;
        }
        case "<": {
          addToken(match("=") ? lox.TokenType.LESS_EQUAL : lox.TokenType.LESS);
          break;
        }
        case ">": {
          addToken(
            match("=") ? lox.TokenType.GREATER_EQUAL : lox.TokenType.GREATER
          );
          break;
        }
        case "/": {
          if (match("/")) {
            // A comment goes until the end of the line.
            while (peek() != "\n" && !isAtEnd()) advance();
          } else {
            addToken(lox.TokenType.SLASH);
          }
          break;
        }
        case " ":
        case "\r":
        case "\t":
          // Ignore whitespace.
          break;
        case "\n": {
          line++;
          break;
        }
        case '"': {
          scanString();
          break;
        }
        default:
          if (isDigit(c)) scanNumber();
          else if (isAlpha(c)) scanIdentifier();
          else lox.Lox.error(line, "Unexpected character.");
      }
    };

    while (!isAtEnd()) {
      // We are at the beginning of the next lexeme.
      start = current;
      scanToken();
    }
    this.tokens.push(
      new lox.Token({
        type: lox.TokenType.EOF,
        lexeme: "",
        literal: undefined,
        line
      })
    );
    return this.tokens;
  }
}
