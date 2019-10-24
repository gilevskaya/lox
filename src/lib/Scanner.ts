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

    const addToken = (type: lox.TokenType) => {
      this.tokens.push(
        new lox.Token({
          type: type,
          lexeme: "",
          literal: undefined,
          line
        })
      );
    };

    const scanToken = () => {
      // consumes the next character in the source file and returns it
      const advance = (): string => {
        current++;
        return this.source[current - 1];
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
        default:
          lox.Lox.error(line, "Unexpected character.");
      }
    };

    while (current < this.source.length) {
      // We are at the beginning of the next lexeme.
      start = current;
      scanToken();
    }
    addToken(lox.TokenType.EOF);
    return this.tokens;
  }
}
