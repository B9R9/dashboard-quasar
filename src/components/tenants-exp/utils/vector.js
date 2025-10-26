// Installer avec npm
// npm install @tensorflow/tfjs @tensorflow-models/universal-sentence-encoder

import * as use from '@tensorflow-models/universal-sentence-encoder'

async function textToVector (text) {
  // Charger le modèle
  const model = await use.load() // charge le modèle USE (lite en fonction de la version)

  // encoder un tableau de phrases (même si c'est une seule)
  const embeddings = await model.embed([text])

  // embeddings est un Tensor de forme [1, dimension] typiquement [1, 512]
  const vector = embeddings.arraySync()[0]

  return vector // un array de floats
}

export { textToVector }
