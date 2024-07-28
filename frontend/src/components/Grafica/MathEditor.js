import React, { useState } from 'react';
import MathQuill, { addStyles, EditableMathField } from 'react-mathquill';

addStyles();

const MathEditor = ({ value, onChange }) => {
  const [latex, setLatex] = useState(value);

  const insertEquation = (equation) => {
    const newLatex = latex + equation;
    setLatex(newLatex);
    onChange(newLatex);
  };

  return (
    <div>
      <EditableMathField
        latex={latex}
        onChange={(mathField) => {
          const newLatex = mathField.latex();
          setLatex(newLatex);
          onChange(newLatex);
        }}
      />
      <div>
        <h3>Operadores Básicos</h3>
        <button onClick={() => insertEquation('+')}>+</button>
        <button onClick={() => insertEquation('-')}>-</button>
        <button onClick={() => insertEquation('*')}>*</button>
        <button onClick={() => insertEquation('/')}>/</button>
        <button onClick={() => insertEquation('=')}>=</button>

        <h3>Griego</h3>
        <button onClick={() => insertEquation('\\alpha')}>α</button>
        <button onClick={() => insertEquation('\\beta')}>β</button>
        <button onClick={() => insertEquation('\\gamma')}>γ</button>
        <button onClick={() => insertEquation('\\theta')}>θ</button>

        <h3>Operadores Globales</h3>
        <button onClick={() => insertEquation('\\sum')}>∑</button>
        <button onClick={() => insertEquation('\\int')}>∫</button>

        <h3>Relaciones</h3>
        <button onClick={() => insertEquation('\\leq')}>≤</button>
        <button onClick={() => insertEquation('\\geq')}>≥</button>
        <button onClick={() => insertEquation('\\neq')}>≠</button>

        <h3>Flechas</h3>
        <button onClick={() => insertEquation('\\rightarrow')}>→</button>
        <button onClick={() => insertEquation('\\leftarrow')}>←</button>

        <h3>Delimitadores</h3>
        <button onClick={() => insertEquation('\\left( \\right)')}>( )</button>
        <button onClick={() => insertEquation('\\left[ \\right]')}>[ ]</button>
        <button onClick={() => insertEquation('\\left\\{ \\right\\}')}>{'{ }'}</button>
      </div>
    </div>
  );
};

export default MathEditor;
