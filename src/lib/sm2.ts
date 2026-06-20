import { SM2State, ReviewRating } from "./types";

/**
 * Implementação do algoritmo SuperMemo 2 (SM-2)
 * @param rating Avaliação do usuário sobre o quão bem ele lembrou do item
 * @param state Estado atual do item (repetição, intervalo, efactor)
 * @returns Novo estado atualizado
 */
export function calculateSM2(rating: ReviewRating, state: SM2State): SM2State {
  let { interval, repetition, efactor } = state;
  
  // Mapeamento de rating para escala qualitativa (0-5)
  // forgot (esqueci) = 0
  // partial (parcial) = 3
  // remembered (lembrei) = 5
  const q = rating === 'forgot' ? 0 : rating === 'partial' ? 3 : 5;

  if (q >= 3) { // Se o usuário lembrou (parcial ou totalmente)
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * efactor);
    }
    repetition++;
  } else { // Se o usuário esqueceu
    repetition = 0;
    interval = 1; // Revisar novamente amanhã
  }

  // Ajuste do E-Factor (Fator de Facilidade)
  // Fórmula padrão SM-2: EF' = f(EF, q)
  efactor = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  
  // O E-Factor não deve cair abaixo de 1.3
  if (efactor < 1.3) efactor = 1.3;

  return { interval, repetition, efactor };
}

export function getInitialSM2State(): SM2State {
  return {
    interval: 0,
    repetition: 0,
    efactor: 2.5,
  };
}
