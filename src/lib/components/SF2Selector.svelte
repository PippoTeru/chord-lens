<script lang="ts">
  import { isDarkMode } from '$lib/stores/settingsStore';

  interface SF2Option {
    name: string;
    url: string;
    size: string;
    description: string;
  }

  const sf2Options: SF2Option[] = [
    {
      name: 'YAMAHA DX7 Piano',
      url: 'https://pub-50ca9c7c99bd45e3a932d181bfe5c961.r2.dev/YAMAHA_DX7Piano.SF2',
      size: '9.3 MB',
      description: '軽量・高速。シンセサイザー系のピアノ音色。'
    },
    {
      name: 'Salamander Grand Piano',
      url: 'https://pub-50ca9c7c99bd45e3a932d181bfe5c961.r2.dev/SalamanderGrandPiano-V3+20200602.sf2',
      size: '1.2 GB',
      description: '高品質・アコースティック。初回ロードに数分かかります。'
    }
  ];

  let { onSelect }: { onSelect: (url: string) => void } = $props();

  function handleSelect(option: SF2Option) {
    onSelect(option.url);
  }
</script>

<div class="sf2-selector-overlay" class:dark={$isDarkMode}>
  <div class="sf2-selector-dialog" class:dark={$isDarkMode}>
    <h2>ピアノ音源を選択してください</h2>
    <p class="subtitle">どちらの音源を使用しますか？</p>

    <div class="options">
      {#each sf2Options as option}
        <button
          class="option-card"
          class:dark={$isDarkMode}
          onclick={() => handleSelect(option)}
        >
          <h3>{option.name}</h3>
          <div class="size">{option.size}</div>
          <p class="description">{option.description}</p>
        </button>
      {/each}
    </div>

    <div class="note">
      <strong>推奨：</strong> 初めての方や、モバイルの方は <strong>YAMAHA DX7 Piano</strong> をお試しください。
    </div>
  </div>
</div>

<style>
  .sf2-selector-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 1rem;
  }

  .sf2-selector-overlay.dark {
    background: rgba(0, 0, 0, 0.85);
  }

  .sf2-selector-dialog {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .sf2-selector-dialog.dark {
    background: #2d2d2d;
    color: #e0e0e0;
  }

  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
    font-weight: 700;
    text-align: center;
  }

  .subtitle {
    margin: 0 0 2rem 0;
    text-align: center;
    color: #666;
    font-size: 0.95rem;
  }

  .sf2-selector-dialog.dark .subtitle {
    color: #999;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .option-card {
    background: #f5f5f5;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .option-card:hover {
    border-color: #4caf50;
    background: #fafafa;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .option-card.dark {
    background: #3a3a3a;
    border-color: #555;
    color: #e0e0e0;
  }

  .option-card.dark:hover {
    border-color: #4caf50;
    background: #404040;
  }

  .option-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .size {
    display: inline-block;
    background: #4caf50;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .description {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #666;
  }

  .option-card.dark .description {
    color: #aaa;
  }

  .note {
    background: #e3f2fd;
    border-left: 4px solid #2196f3;
    padding: 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .sf2-selector-dialog.dark .note {
    background: #1a3a4a;
    border-left-color: #4caf50;
  }

  .note strong {
    color: #1976d2;
  }

  .sf2-selector-dialog.dark .note strong {
    color: #4caf50;
  }

  @media (max-width: 640px) {
    .sf2-selector-dialog {
      padding: 1.5rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    .option-card {
      padding: 1.25rem;
    }
  }
</style>
