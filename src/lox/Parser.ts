// http://craftinginterpreters.com/parsing-expressions.html
import * as lox from "../lox";

export class Parser {
  current: number = 0;
  constructor(public readonly tokens: lox.Token[]) {}

  public parse(): lox.Expr.Expr | null {
    try {
      return this.expression();
    } catch (error) {
      console.error("Parser error:", error);
      return null;
    }
  }

  private expression(): lox.Expr.Expr {
    return this.equality();
  }

  private equality(): lox.Expr.Expr {
    let expr: lox.Expr.Expr = this.comparison();
    while (this.match(lox.TokenType.BANG_EQUAL, lox.TokenType.EQUAL_EQUAL)) {
      const operator: lox.Token = this.previous();
      const right: lox.Expr.Expr = this.comparison();
      expr = new lox.Expr.Binary(expr, operator, right);
    }
    return expr;
  }

  private match(...types: lox.TokenType[]): any {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: lox.TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().token.type == type;
  }

  private advance(): lox.Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().token.type == lox.TokenType.EOF;
  }

  private peek(): lox.Token {
    return this.tokens[this.current];
  }

  private previous(): lox.Token {
    return this.tokens[this.current - 1];
  }

  private comparison(): lox.Expr.Expr {
    let expr: lox.Expr.Expr = this.addition();
    while (
      this.match(
        lox.TokenType.GREATER,
        lox.TokenType.GREATER_EQUAL,
        lox.TokenType.LESS,
        lox.TokenType.LESS_EQUAL
      )
    ) {
      const operator: lox.Token = this.previous();
      const right: lox.Expr.Expr = this.addition();
      expr = new lox.Expr.Binary(expr, operator, right);
    }
    return expr;
  }

  private addition(): lox.Expr.Expr {
    let expr: lox.Expr.Expr = this.multiplication();
    while (this.match(lox.TokenType.MINUS, lox.TokenType.PLUS)) {
      const operator: lox.Token = this.previous();
      const right: lox.Expr.Expr = this.multiplication();
      expr = new lox.Expr.Binary(expr, operator, right);
    }
    return expr;
  }

  private multiplication(): lox.Expr.Expr {
    let expr: lox.Expr.Expr = this.unary();
    while (this.match(lox.TokenType.SLASH, lox.TokenType.STAR)) {
      const operator: lox.Token = this.previous();
      const right: lox.Expr.Expr = this.unary();
      expr = new lox.Expr.Binary(expr, operator, right);
    }
    return expr;
  }

  private unary(): lox.Expr.Expr {
    if (this.match(lox.TokenType.BANG, lox.TokenType.MINUS)) {
      const operator: lox.Token = this.previous();
      const right: lox.Expr.Expr = this.unary();
      return new lox.Expr.Unary(operator, right);
    }
    return this.primary();
  }

  private primary(): lox.Expr.Expr {
    if (this.match(lox.TokenType.FALSE)) return new lox.Expr.Literal(false);
    if (this.match(lox.TokenType.TRUE)) return new lox.Expr.Literal(true);
    if (this.match(lox.TokenType.NIL)) return new lox.Expr.Literal(null);

    if (this.match(lox.TokenType.NUMBER, lox.TokenType.STRING)) {
      return new lox.Expr.Literal(this.previous().token.literal);
    }

    if (this.match(lox.TokenType.LEFT_PAREN)) {
      const expr: lox.Expr.Expr = this.expression();
      this.consume(lox.TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new lox.Expr.Grouping(expr);
    }
    throw new Error(
      "Parser: Unexpected grouping" + JSON.stringify(this.peek())
    );
  }

  private consume(type: lox.TokenType, message: string): lox.Token {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  private error(token: lox.Token, message: string): ParseError {
    lox.Lox.error(token, message);
    return new ParseError();
  }
}

class ParseError extends Error {
  constructor(...args: any) {
    super();
    throw new Error(...args);
  }
}
