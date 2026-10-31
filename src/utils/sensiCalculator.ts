import { SensiConfig, SensiQuestionnaire } from '../types';

export function calculateSensibility(answers: SensiQuestionnaire): SensiConfig {
  const { phoneModel, sensiType, dpiOption, buttonOption, mode } = answers;
  const isIPhone = /iphone|ios|apple/i.test(phoneModel);
  const isSamsung = /samsung|galaxy/i.test(phoneModel);
  const isXiaomi = /xiaomi|redmi|poco/i.test(phoneModel);

  // User specified exact ranges:
  // Altas: 200 - 170
  // Medias: 160 - 130
  // Bajas: 120 - 90
  let general = 185;
  let redDot = 180;
  let scope2x = 175;
  let scope4x = 170;
  let sniper = 90;
  let cam360 = 180;
  let pointerSpeed = 'Rápida';
  let dpi = 'Predeterminado (411)';
  let fireButton: string | null = null;

  if (sensiType === 'Alta') {
    // 170 - 200
    general = 198;
    redDot = 195;
    scope2x = 188;
    scope4x = 182;
    sniper = 105;
    cam360 = 190;
    pointerSpeed = 'Máxima';
  } else if (sensiType === 'Media') {
    // 130 - 160
    general = 158;
    redDot = 152;
    scope2x = 145;
    scope4x = 138;
    sniper = 75;
    cam360 = 148;
    pointerSpeed = 'Rápida (3/4)';
  } else {
    // Baja: 90 - 120
    general = 118;
    redDot = 112;
    scope2x = 105;
    scope4x = 98;
    sniper = 55;
    cam360 = 105;
    pointerSpeed = 'Media';
  }

  // Adjust for DPI
  if (dpiOption === 'Con dpi') {
    if (isIPhone) {
      dpi = 'Ciclos 120';
    } else if (isXiaomi) {
      dpi = sensiType === 'Alta' ? '720 DPI' : '580 DPI';
    } else if (isSamsung) {
      dpi = sensiType === 'Alta' ? '850 DPI' : '620 DPI';
    } else {
      dpi = sensiType === 'Alta' ? '750 DPI' : '600 DPI';
    }
  } else {
    dpi = isIPhone ? 'Sin DPI (Estándar iOS)' : 'Sin DPI (Predeterminado)';
  }

  // Adjust for Mode
  if (mode === 'Modo de deku') {
    if (sensiType === 'Alta') {
      general = 194;
      redDot = 190;
      scope2x = 184;
    } else if (sensiType === 'Media') {
      general = 152;
      redDot = 146;
      scope2x = 140;
    } else {
      general = 114;
      redDot = 108;
      scope2x = 102;
    }
  } else if (mode === 'Modo nagie') {
    if (sensiType === 'Alta') {
      general = 200;
      redDot = 198;
      scope2x = 194;
      scope4x = 188;
    } else if (sensiType === 'Media') {
      general = 160;
      redDot = 156;
      scope2x = 150;
      scope4x = 144;
    } else {
      general = 120;
      redDot = 116;
      scope2x = 110;
      scope4x = 104;
    }
  } else if (mode === 'Modo L-PRIME') {
    if (sensiType === 'Alta') {
      general = 200;
      redDot = 196;
      scope2x = 190;
      scope4x = 185;
      pointerSpeed = 'Al máximo';
    } else if (sensiType === 'Media') {
      general = 156;
      redDot = 150;
      scope2x = 144;
      scope4x = 138;
      pointerSpeed = 'Al máximo';
    } else {
      general = 118;
      redDot = 112;
      scope2x = 106;
      scope4x = 100;
      pointerSpeed = 'Al máximo';
    }
  }

  // Check buttonOption: "Sin botón de disparo o con botón porfa"
  if (buttonOption === 'Con botón') {
    if (mode === 'Modo nagie') {
      fireButton = '40%';
    } else if (mode === 'Modo L-PRIME') {
      fireButton = '43%';
    } else {
      fireButton = sensiType === 'Alta' ? '44%' : sensiType === 'Media' ? '49%' : '54%';
    }
  } else {
    fireButton = null;
  }

  return {
    general,
    redDot,
    scope2x,
    scope4x,
    sniper,
    cam360,
    dpi,
    fireButton,
    pointerSpeed,
    phoneModel,
    sensiType,
    dpiOption,
    buttonOption,
    mode,
  };
}
