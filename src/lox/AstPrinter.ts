// http://craftinginterpreters.com/representing-code.html

import * as lox from "./";

export class AstPrinter implements lox.Expr.Visitor<string> {
  print(expr: lox.Expr.Expr) {
    return expr.accept(this);
  }

  visitUnaryExpr(expr: lox.Expr.Unary): string {
    throw new Error("Method not implemented.");
  }
  visitCallExpr(expr: lox.Expr.Call): string {
    throw new Error("Method not implemented.");
  }
  visitGetExpr(expr: lox.Expr.Get): string {
    throw new Error("Method not implemented.");
  }
  visitGroupingExpr(expr: lox.Expr.Grouping): string {
    throw new Error("Method not implemented.");
  }
  visitVariableExpr(expr: lox.Expr.Variable): string {
    throw new Error("Method not implemented.");
  }

  public visitAssignExpr(expr: lox.Expr.Assign): string {
    return expr.name.token.lexeme + " = " + this.print(expr.value);
  }
  public visitLiteralExpr(expr: lox.Expr.Literal): string {
    return expr.value.toString();
  }

  public visitBinaryExpr(expr: lox.Expr.Binary): string {
    return (
      this.print(expr.left) +
      " " +
      expr.operator.token.lexeme +
      " " +
      this.print(expr.right)
    );
  }
}
