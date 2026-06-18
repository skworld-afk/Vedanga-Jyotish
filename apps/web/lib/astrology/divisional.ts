export function getDivisionalLongitude(lon: number, d: number): number {
  const sign = Math.floor(lon / 30);
  const degree = lon % 30;
  
  if (d === 1) return lon;
  
  if (d === 2) { // Hora
    const isOddSign = sign % 2 === 0;
    const isFirstHalf = degree < 15;
    let targetSign = 0;
    if (isOddSign) targetSign = isFirstHalf ? 4 : 3;
    else targetSign = isFirstHalf ? 3 : 4;
    return targetSign * 30 + 15;
  }
  
  if (d === 3) { // Drekkana
    const decanate = Math.floor(degree / 10);
    const targetSign = (sign + decanate * 4) % 12;
    return targetSign * 30 + 15;
  }
  
  if (d === 4) { // Chaturthamsha
    const part = Math.floor(degree / 7.5);
    const targetSign = (sign + part * 3) % 12;
    return targetSign * 30 + 15;
  }
  
  if (d === 7) { // Saptamsha
    const part = Math.floor(degree / (30 / 7));
    const isOddSign = sign % 2 === 0;
    const startSign = isOddSign ? sign : (sign + 6) % 12;
    const targetSign = (startSign + part) % 12;
    return targetSign * 30 + 15;
  }
  
  if (d === 9) { // Navamsha
    const part = Math.floor(degree / (30 / 9));
    const element = sign % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
    const startSigns = [0, 9, 6, 3];
    const startSign = startSigns[element] ?? 0;
    const targetSign = (startSign + part) % 12;
    return targetSign * 30 + 15;
  }
  
  if (d === 10) { // Dashamsha
    const part = Math.floor(degree / 3);
    const isOddSign = sign % 2 === 0;
    const startSign = isOddSign ? sign : (sign + 8) % 12;
    const targetSign = (startSign + part) % 12;
    return targetSign * 30 + 15;
  }
  
  if (d === 12) { // Dwadashamsha
    const part = Math.floor(degree / 2.5);
    const targetSign = (sign + part) % 12;
    return targetSign * 30 + 15;
  }
  
  if (d === 16) { // Shodashamsha
    const part = Math.floor(degree / (30 / 16));
    const isMovable = sign % 3 === 0;
    const isFixed = sign % 3 === 1;
    let startSign = 0;
    if (isFixed) startSign = 4;
    else if (!isMovable && !isFixed) startSign = 8;
    const targetSign = (startSign + part) % 12;
    return targetSign * 30 + 15;
  }

  if (d === 20) { // Vimshamsha
    const part = Math.floor(degree / 1.5);
    const isMovable = sign % 3 === 0;
    const isFixed = sign % 3 === 1;
    let startSign = 0;
    if (isFixed) startSign = 8;
    else if (!isMovable && !isFixed) startSign = 4;
    const targetSign = (startSign + part) % 12;
    return targetSign * 30 + 15;
  }

  if (d === 24) { // Chaturvimshamsha
    const part = Math.floor(degree / 1.25);
    const isOddSign = sign % 2 === 0;
    const startSign = isOddSign ? 4 : 3;
    const targetSign = (startSign + part) % 12;
    return targetSign * 30 + 15;
  }

  if (d === 27) { // Bhamsha
    const part = Math.floor(degree / (30 / 27));
    const element = sign % 4;
    const startSigns = [0, 3, 6, 9];
    const startSign = startSigns[element] ?? 0;
    const targetSign = (startSign + part) % 12;
    return targetSign * 30 + 15;
  }
  
  if (d === 30) { // Trimshamsha
    const isOddSign = sign % 2 === 0;
    let targetSign = 0;
    if (isOddSign) {
      if (degree < 5) targetSign = 0; else if (degree < 10) targetSign = 10; else if (degree < 18) targetSign = 8; else if (degree < 25) targetSign = 2; else targetSign = 6;
    } else {
      if (degree < 5) targetSign = 1; else if (degree < 12) targetSign = 5; else if (degree < 20) targetSign = 11; else if (degree < 25) targetSign = 9; else targetSign = 7;
    }
    return targetSign * 30 + 15;
  }

  if (d === 40) { // Khavedamsha
    const part = Math.floor(degree / (30 / 40));
    const isOddSign = sign % 2 === 0;
    const startSign = isOddSign ? 0 : 6;
    const targetSign = (startSign + part) % 12;
    return targetSign * 30 + 15;
  }

  if (d === 45) { // Akshavedamsha
    const part = Math.floor(degree / (30 / 45));
    const isMovable = sign % 3 === 0;
    const isFixed = sign % 3 === 1;
    let startSign = 0;
    if (isFixed) startSign = 4;
    else if (!isMovable && !isFixed) startSign = 8;
    const targetSign = (startSign + part) % 12;
    return targetSign * 30 + 15;
  }
  
  if (d === 60) { // Shashtiamsha
    const part = Math.floor(degree / 0.5);
    const targetSign = (sign + part) % 12;
    return targetSign * 30 + 15;
  }

  return lon;
}

export function calculateAllDivisionalCharts(planets: Record<string, number>): Record<string, Record<string, number>> {
  const divisions = [1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60];
  const charts: Record<string, Record<string, number>> = {};
  
  divisions.forEach(d => {
    const divKey = `D${d}`;
    const currentDiv: Record<string, number> = {};
    charts[divKey] = currentDiv;
    Object.entries(planets).forEach(([p, lon]) => {
      if (['mc', 'midheaven', 'ayanamsha'].includes(p.toLowerCase())) return;
      currentDiv[p] = getDivisionalLongitude(lon, d);
    });
  });
  
  return charts;
}