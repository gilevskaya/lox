// http://craftinginterpreters.com/scanning.html

export enum TokenType {
  // Single-character tokens.
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  COMMA,
  DOT,
  MINUS,
  PLUS,
  SEMICOLON,
  SLASH,
  STAR,

  // One or two character tokens.
  BANG,
  BANG_EQUAL,
  EQUAL,
  EQUAL_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,

  // Literals.
  IDENTIFIER,
  STRING,
  NUMBER,

  // Keywords.
  AND,
  CLASS,
  ELSE,
  FALSE,
  FUN,
  FOR,
  IF,
  NIL,
  OR,
  PRINT,
  RETURN,
  SUPER,
  THIS,
  TRUE,
  VAR,
  WHILE,

  EOF
}

interface IToken {
  type: TokenType;
  lexeme: string;
  literal?: object;
  line: number; // code line for errors
}

export class Token {
  public token: IToken;

  constructor(token: IToken) {
    this.token = token;
  }

  public toString(): string {
    const { type, lexeme, literal } = this.token;
    return TokenType[type] + " " + lexeme + (literal || "");
  }
}
