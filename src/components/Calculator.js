import React, { useState, useEffect } from 'react';
import Display from './Display';
import Button from './Button';
import { solveExpression, isOperatorChar, formatResult } from '../utils/calculatorLogic';
import '../styles/Calculator.css';

const Calculator = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [wasCalculated, setWasCalculated] = useState(false);

  const addNumber = (num) => {
    if (wasCalculated) {
      setCurrentInput(num);
      setWasCalculated(false);
    } else {
      if (currentInput === '0') {
        setCurrentInput(num);
      } else {
        setCurrentInput(prev => prev + num);
      }
    }
  };

  const addDecimal = () => {
    if (wasCalculated) {
      setCurrentInput('0.');
      setWasCalculated(false);
    } else {
      let parts = currentInput.split(/[\+\-\*\/]/);
      let lastNumber = parts[parts.length - 1];
      
      if (!lastNumber.includes('.')) {
        if (currentInput === '' || isOperatorChar(currentInput.slice(-1))) {
          setCurrentInput(prev => prev + '0.');
        } else {
          setCurrentInput(prev => prev + '.');
        }
      }
    }
  };

  const addOperator = (op) => {
    if (wasCalculated) {
      setWasCalculated(false);
    }

    setCurrentInput(prev => {
      let input = prev;
      if (input === '') {
        input = '0';
      }

      let lastChar = input.slice(-1);
      
      if (isOperatorChar(lastChar)) {
        return input.slice(0, -1) + op;
      } else {
        return input + op;
      }
    });
  };

  const doCalculation = () => {
    if (currentInput === '') return;
    
    try {
      let result = solveExpression(currentInput);
      
      if (result !== null && !isNaN(result) && isFinite(result)) {
        setCurrentInput(formatResult(result));
        setWasCalculated(true);
      } else {
        throw new Error('Bad calculation');
      }
    } catch (e) {
      setCurrentInput('Error');
      setTimeout(() => {
        setCurrentInput('');
      }, 1500);
    }
  };

  const clearEverything = () => {
    setCurrentInput('');
    setWasCalculated(false);
  };

  const backspace = () => {
    if (wasCalculated) {
      clearEverything();
      return;
    }

    setCurrentInput(prev => prev.slice(0, -1));
  };

  const formatDisplay = (input) => {
    if (!input) return '0';
    
    let display = input;
    display = display.replace(/\*/g, '×');
    display = display.replace(/\//g, '÷');
    display = display.replace(/\-/g, '−');
    
    return display;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      let key = event.key;
      
      if (/[0-9]/.test(key)) {
        addNumber(key);
      }
      else if (key === '.') {
        addDecimal();
      }
      else if (key === '+') {
        addOperator('+');
      }
      else if (key === '-') {
        addOperator('-');
      }
      else if (key === '*') {
        addOperator('*');
      }
      else if (key === '/') {
        event.preventDefault();
        addOperator('/');
      }
      else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        doCalculation();
      }
      else if (key === 'Escape') {
        clearEverything();
      }
      else if (key === 'Backspace') {
        event.preventDefault();
        backspace();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentInput, wasCalculated]);

  return (
    <div className="calculator">
      <Display 
        display={formatDisplay(currentInput) || '0'} 
        preview="" 
      />
      
      <div className="buttons">
        <Button className="clear" onClick={clearEverything}>AC</Button>
        <Button className="clear" onClick={backspace}>⌫</Button>
        <Button className="operator" onClick={() => addOperator('/')}>÷</Button>
        <Button className="operator" onClick={() => addOperator('*')}>×</Button>
        
        <Button className="number" onClick={() => addNumber('7')}>7</Button>
        <Button className="number" onClick={() => addNumber('8')}>8</Button>
        <Button className="number" onClick={() => addNumber('9')}>9</Button>
        <Button className="operator" onClick={() => addOperator('-')}>−</Button>
        
        <Button className="number" onClick={() => addNumber('4')}>4</Button>
        <Button className="number" onClick={() => addNumber('5')}>5</Button>
        <Button className="number" onClick={() => addNumber('6')}>6</Button>
        <Button className="operator" onClick={() => addOperator('+')}>+</Button>
        
        <Button className="number" onClick={() => addNumber('1')}>1</Button>
        <Button className="number" onClick={() => addNumber('2')}>2</Button>
        <Button className="number" onClick={() => addNumber('3')}>3</Button>
        <Button className="equals" onClick={doCalculation}>=</Button>
        
        <Button className="number zero" onClick={() => addNumber('0')}>0</Button>
        <Button className="number" onClick={addDecimal}>.</Button>
      </div>
    </div>
  );
};

export default Calculator;