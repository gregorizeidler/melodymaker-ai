# MelodyMakerAI Backend

Backend para geração de música com IA usando Modal.

## Tecnologias

- **Modal** - Serverless GPU computing
- **ACE-Step** - Modelo de geração de música
- **Qwen 2-7B** - LLM para geração de prompts e letras
- **Stable Diffusion XL Turbo** - Geração de thumbnails
- **Backblaze B2** - Armazenamento de arquivos

## Setup

1. Instalar dependências:
```bash
uv sync
```

2. Configurar Modal:
```bash
modal token new
```

3. Criar secret no Modal:
```bash
modal secret create melodymaker-secret \
  B2_BUCKET_NAME=your-bucket \
  B2_KEY_ID=your-key \
  B2_APP_KEY=your-app-key \
  B2_ENDPOINT=https://s3.us-east-005.backblazeb2.com
```

4. Deploy:
```bash
modal deploy main.py
```

## Endpoints

### `generate_with_description`
Gera música a partir de uma descrição completa.

### `generate_with_lyrics`
Gera música com letras customizadas.

### `generate_with_described_lyrics`
Gera música com descrição de letras (IA gera as letras).

## Desenvolvimento Local

```bash
modal serve main.py
```
