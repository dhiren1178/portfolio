export interface Gesture { id: string; label: string; }
// The actual project recognizes ASL alphabet classes; the demo is simulated.
export const gestures: Gesture[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => ({id:letter.toLowerCase(),label:letter}));
export interface Prediction {gestureId:string;confidence:number;}
export function generateMockPrediction(): Prediction[] {
 const winner = Math.floor(Math.random()*gestures.length);
 const raw = gestures.map((_,i)=>i===winner?3+Math.random()*2:Math.random()*0.15);
 const sum = raw.reduce((a,b)=>a+b,0);
 return gestures.map((g,i)=>({gestureId:g.id,confidence:raw[i]/sum})).sort((a,b)=>b.confidence-a.confidence);
}
