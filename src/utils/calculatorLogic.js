export function solveExpression(expr) {
  expr = expr.replace(/[\+\-\*\/]+$/, '');
  
  if (expr === '') return 0;
  
  if (expr.includes('/0')) {
    throw new Error('Cannot divide by zero');
  }
  
  return doPEMDAS(expr);
}

function doPEMDAS(expr) {
  let tokens = breakIntoTokens(expr);
  
  if (tokens.length === 0) return 0;
  if (tokens.length === 1) return parseFloat(tokens[0]);

  let i = 1;
  while (i < tokens.length) {
    if (tokens[i] === '*' || tokens[i] === '/') {
      let left = parseFloat(tokens[i - 1]);
      let right = parseFloat(tokens[i + 1]);
      let result;
      
      if (tokens[i] === '*') {
        result = left * right;
      } else {
        if (right === 0) throw new Error('Division by zero');
        result = left / right;
      }
      
      tokens.splice(i - 1, 3, result.toString());
    } else {
      i += 2;
    }
  }
  
  i = 1;
  while (i < tokens.length) {
    if (tokens[i] === '+' || tokens[i] === '-') {
      let left = parseFloat(tokens[i - 1]);
      let right = parseFloat(tokens[i + 1]);
      let result;
      
      if (tokens[i] === '+') {
        result = left + right;
      } else {
        result = left - right;
      }
      
      tokens.splice(i - 1, 3, result.toString());
    } else {
      i += 2;
    }
  }
  
  return parseFloat(tokens[0]);
}

function breakIntoTokens(expr) {
  let tokens = [];
  let currentNum = '';
  
  for (let i = 0; i < expr.length; i++) {
    let char = expr[i];
    
    if (isOperatorChar(char)) {
      if (currentNum !== '') {
        tokens.push(currentNum);
        currentNum = '';
      }
      tokens.push(char);
    } else {
      currentNum += char;
    }
  }
  
  if (currentNum !== '') {
    tokens.push(currentNum);
  }
  
  return tokens;
}

export function isOperatorChar(char) {
  return ['+', '-', '*', '/'].includes(char);
}

export function formatResult(num) {
  if (num === undefined || num === null) return '0';
  
  if (Math.abs(num) > 999999999 || (Math.abs(num) < 0.000001 && num !== 0)) {
    return num.toExponential(6);
  }
  
  if (num % 1 === 0) {
    return num.toString();
  } else {
    return parseFloat(num.toFixed(8)).toString();
  }
}