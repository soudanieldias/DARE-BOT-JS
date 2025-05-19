const soundpadCategories = {
  spad_audios: { path: './src/audios/audios', category: 'audios' },
  spad_frases: { path: './src/audios/frases', category: 'frases' },
  spad_memes: { path: './src/audios/memes', category: 'memes' },
  spad_musicas: { path: './src/audios/musicas', category: 'musicas' },
  spad_times: { path: './src/audios/times', category: 'times' },
};

const categoryOptions = [
  { label: 'audios', value: 'spad_audios' },
  { label: 'frases', value: 'spad_frases' },
  { label: 'memes', value: 'spad_memes' },
  { label: 'musicas', value: 'spad_musicas' },
  { label: 'times', value: 'spad_times' },
];

module.exports = {
  soundpadCategories,
  categoryOptions,
};
