(() => {
  const translations = {
    th: {
      common: {
        brand: 'เสียงเล็ก',
        mainNav: 'เมนูหลัก',
        compress: 'บีบเสียง',
        split: 'แบ่งไฟล์',
        transcribe: 'ถอดเสียงด้วย AI',
        backCompress: '← กลับไปบีบเสียง',
        languageButton: 'English',
        languageLabel: 'เปลี่ยนภาษาเป็นภาษาอังกฤษ',
        brandTagline: 'เครื่องมือเสียง',
        mobileMenu: 'เปิด/ปิด เมนู',
        badgeLocal: 'ในเครื่อง',
        badgeAi: 'AI',
        localOnly: 'อยู่ในอุปกรณ์นี้เท่านั้น',
        chooseFile: 'เลือกไฟล์เสียง หรือลากมาวางที่นี่',
        changeFile: 'เปลี่ยนไฟล์',
        done: 'เสร็จแล้ว',
        privacy: 'ความเป็นส่วนตัว',
        privacyLocal: 'ไฟล์ถูกอ่านและประมวลผลภายในเบราว์เซอร์ของคุณเท่านั้น ไม่มีบัญชีผู้ใช้ ไม่มีฐานข้อมูล และไม่มีพื้นที่เก็บไฟล์บนเซิร์ฟเวอร์',
        audioTypes: 'รองรับ M4A, MP3, WAV, AAC และ OGG',
        audioTypesWebm: 'รองรับ M4A, MP3, WAV, AAC, OGG และ WebM',
        selectAudioError: 'กรุณาเลือกไฟล์เสียง เช่น M4A, MP3, WAV, AAC หรือ OGG',
        selectAudioWebmError: 'กรุณาเลือกไฟล์เสียง เช่น M4A, MP3, WAV, AAC, OGG หรือ WebM',
        browserError: 'ไม่สามารถทำงานกับไฟล์นี้ได้ ลองใช้ Chrome หรือ Edge เวอร์ชันล่าสุด และตรวจสอบว่าหน่วยความจำในเครื่องเพียงพอ',
        loadingProcessor: 'กำลังโหลดตัวประมวลผลครั้งแรก…',
        preparing: 'กำลังเตรียมไฟล์…',
        reading: 'กำลังอ่านไฟล์…',
        firstLoadNote: 'ครั้งแรกจะโหลดตัวประมวลผลประมาณ 31 MB เพียงครั้งเดียว',
        browserProcessingNote: 'กำลังทำงานในเบราว์เซอร์ของคุณ',
        percent: '{{value}}%',
        fileSize: '{{size}}',
        minutesSeconds: '{{minutes}} นาที {{seconds}} วินาที',
        minutesSecondsEn: '{{minutes}} min {{seconds}} sec',
      },
      compressor: {
        title: 'บีบเสียง — ทำงานในเครื่องคุณ',
        description: 'บีบอัดไฟล์เสียงในเบราว์เซอร์ โดยไม่อัปโหลดไฟล์ไปยังเซิร์ฟเวอร์',
        eyebrow: 'AUDIO COMPRESSOR',
        heroTitleA: 'บีบเสียงให้เล็ก',
        heroTitleB: 'โดยไม่ต้องอัปโหลด',
        heroIntro: 'เปลี่ยนไฟล์เสียงขนาดใหญ่ให้เป็น M4A ที่เบาลง โดยทุกอย่างเกิดขึ้นในเบราว์เซอร์ของคุณ',
        pointLocal: '100% ในเครื่อง',
        pointAccount: 'ไม่ต้องสมัครสมาชิก',
        stepFile: '01 — เลือกไฟล์',
        sourceTitle: 'ไฟล์เสียงต้นฉบับ',
        stepSettings: '02 — คุณภาพสำหรับเสียงพูด',
        settingsTitle: 'ตั้งค่าไฟล์ปลายทาง',
        bitrate: 'บิตเรต',
        bitrate24: '24 kbps — เล็กที่สุด',
        bitrate32: '32 kbps — แนะนำ',
        bitrate48: '48 kbps — ชัดขึ้น',
        formatLabel: 'รูปแบบ',
        formatValue: 'M4A / AAC',
        audioLabel: 'เสียง',
        audioValue: 'Mono · 16 kHz',
        compressButton: 'บีบอัดไฟล์เสียง',
        loadingEncoder: 'กำลังโหลดตัวเข้ารหัสครั้งแรก…',
        compressing: 'กำลังบีบอัดไฟล์เสียง…',
        reading: 'กำลังอ่านไฟล์…',
        resultTitle: 'ไฟล์พร้อมดาวน์โหลด',
        download: 'ดาวน์โหลด M4A',
        resultSummary: '{{input}} → {{output}} · เล็กลง {{reduction}}%',
        error: 'ไม่สามารถบีบอัดไฟล์นี้ได้ ลองใช้เบราว์เซอร์ Chrome หรือ Edge เวอร์ชันล่าสุด และตรวจสอบว่าหน่วยความจำในเครื่องเพียงพอ',
      },
      split: {
        title: 'แบ่งไฟล์เสียง — ทำงานในเครื่องคุณ',
        description: 'แบ่งไฟล์เสียงเป็นหลายส่วนในเบราว์เซอร์ โดยไม่อัปโหลดไฟล์',
        eyebrow: 'LOCAL AUDIO SPLITTER',
        heroTitleA: 'แบ่งไฟล์ใหญ่',
        heroTitleB: 'เป็นส่วนพอดี',
        heroIntro: 'เลือกจำนวนไฟล์ที่ต้องการ แล้วดาวน์โหลดแต่ละส่วนได้ทันที ทุกอย่างทำงานในเบราว์เซอร์ของคุณ',
        stepFile: '01 — เลือกไฟล์',
        sourceTitle: 'ไฟล์เสียงต้นฉบับ',
        stepCount: '02 — กำหนดจำนวน',
        countTitle: 'ต้องการแบ่งกี่ไฟล์',
        loadingDuration: 'กำลังอ่านความยาวไฟล์…',
        countLabel: 'จำนวนส่วน',
        countHint: '2–50 ไฟล์',
        splitButton: 'แบ่งไฟล์เสียง',
        statusLoading: 'กำลังโหลดตัวประมวลผลครั้งแรก…',
        statusPreparing: 'กำลังเตรียมไฟล์…',
        statusPart: 'กำลังแบ่งส่วนที่ {{current}} จาก {{total}}…',
        statusDone: 'แบ่งไฟล์เสร็จแล้ว',
        statusNote: 'ไฟล์ถูกประมวลผลในเบราว์เซอร์ ไม่ได้อัปโหลดไปที่ใด',
        estimate: 'ไฟล์ละประมาณ {{duration}} · {{size}} (อิงจากขนาดไฟล์เดิม)',
        resultsTitle: 'ไฟล์ที่แบ่งแล้ว {{count}} ส่วน',
        downloadAll: 'ดาวน์โหลดทั้งหมด .zip',
        packing: 'กำลังแพ็ก .zip…',
        clearResults: 'ล้างไฟล์ผลลัพธ์',
        part: 'ส่วน {{index}}',
        downloadPart: 'ดาวน์โหลด ↓',
        durationError: 'ไม่สามารถอ่านความยาวไฟล์นี้ได้ ลองใช้ M4A, MP3 หรือ WAV',
        splitError: 'แบ่งไฟล์ไม่สำเร็จ ลองใช้ M4A, MP3 หรือ WAV และตรวจสอบว่าหน่วยความจำในเครื่องเพียงพอ',
        zipError: 'สร้าง ZIP ไม่สำเร็จ ลองดาวน์โหลดแยกทีละไฟล์ หรือปิดแอปอื่นเพื่อเพิ่มหน่วยความจำ',
        privacy: 'ไฟล์ไม่ถูกอัปโหลด ไม่มีฐานข้อมูล และไม่มีพื้นที่เก็บไฟล์บนเซิร์ฟเวอร์ หากต้องการส่งไปถอดเสียง ให้เลือกจำนวนส่วนที่ทำให้แต่ละไฟล์ต่ำกว่า 4 MB',
      },
      transcribe: {
        title: 'ถอดเสียง — AI',
        description: 'ถอดเสียงเป็นข้อความด้วย AI โดยจำกัดไฟล์ 4 MB',
        eyebrow: 'AI TRANSCRIPTION',
        heroTitleA: 'เปลี่ยนเสียงเป็น',
        heroTitleB: 'ข้อความพร้อมใช้',
        heroIntro: 'อัปโหลดไฟล์เสียงขนาดไม่เกิน 4 MB แล้วรับข้อความถอดเสียงทันที',
        stepFile: '01 — เลือกไฟล์',
        sourceTitle: 'ไฟล์เสียงสำหรับถอดเสียง',
        limit: 'สูงสุด 4 MB',
        types: 'รองรับ M4A, MP3, WAV, AAC, OGG และ WebM · ไม่เกิน 4 MB',
        stepStart: '02 — เริ่มถอดเสียง',
        optionsTitle: 'อ่านข้อความจากไฟล์เสียง',
        optionsIntro: 'ระบบจะรักษาภาษาต้นฉบับของผู้พูด และจัดย่อหน้าให้อ่านง่าย',
        button: 'ถอดเสียงเป็นข้อความ',
        statusSending: 'กำลังส่งไฟล์เพื่อถอดเสียง…',
        statusSendingAi: 'กำลังส่งไฟล์ไปยัง AI…',
        statusAi: 'AI กำลังถอดเสียง…',
        statusDone: 'ถอดเสียงเสร็จแล้ว',
        progressLabel: 'ความคืบหน้าการถอดเสียง',
        statusNote: 'ความคืบหน้าโดยประมาณ อย่าปิดหน้านี้จนกว่าจะได้ผลลัพธ์',
        resultTitle: 'ข้อความถอดเสียง',
        copy: 'คัดลอก',
        copied: 'คัดลอกแล้ว',
        download: 'ดาวน์โหลด .md',
        dataTitle: 'ข้อมูลของคุณ',
        privacy: 'เว็บนี้ไม่มีฐานข้อมูลหรือพื้นที่เก็บไฟล์ ไฟล์ที่เลือกจะถูกส่งผ่าน Netlify ไปยัง AI ใน request เดียวเพื่อถอดเสียง ไฟล์ต้องไม่เกิน 4 MB เพื่อให้ส่งผ่านฟังก์ชันได้อย่างเสถียร',
        emptyFile: 'ไฟล์นี้ว่างเปล่า กรุณาเลือกไฟล์เสียงอื่น',
        tooLarge: 'ไฟล์ {{size}} ใหญ่เกินขีดจำกัด 4 MB กรุณาบีบอัดหรือตัดไฟล์ให้เล็กลงก่อน',
        unavailable: 'ไม่สามารถถอดเสียงได้ในขณะนี้',
        noText: 'ไม่ได้รับข้อความถอดเสียงจากบริการ',
        genericError: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
        copyError: 'คัดลอกไม่สำเร็จ กรุณาเลือกข้อความจากกล่องผลลัพธ์เอง',
        markdownTitle: 'ถอดเสียง: {{name}}',
        ready: 'พร้อมถอดเสียง',
      },
    },
    en: {
      common: {
        brand: 'AudioLite',
        mainNav: 'Main navigation',
        compress: 'Compress',
        split: 'Split audio',
        transcribe: 'AI transcription',
        backCompress: '← Back to compressor',
        languageButton: 'ภาษาไทย',
        languageLabel: 'Switch language to Thai',
        brandTagline: 'Audio Tools',
        mobileMenu: 'Toggle menu',
        badgeLocal: 'Local',
        badgeAi: 'AI',
        localOnly: 'Stays on this device',
        chooseFile: 'Choose an audio file or drag it here',
        changeFile: 'Change file',
        done: 'Done',
        privacy: 'Privacy',
        privacyLocal: 'Files are read and processed only in your browser. No user account, database, or server file storage is used.',
        audioTypes: 'Supports M4A, MP3, WAV, AAC, and OGG',
        audioTypesWebm: 'Supports M4A, MP3, WAV, AAC, OGG, and WebM',
        selectAudioError: 'Choose an audio file such as M4A, MP3, WAV, AAC, or OGG',
        selectAudioWebmError: 'Choose an audio file such as M4A, MP3, WAV, AAC, OGG, or WebM',
        browserError: 'This file could not be processed. Try the latest Chrome or Edge and make sure your device has enough memory.',
        loadingProcessor: 'Loading the processor for the first time…',
        preparing: 'Preparing the file…',
        reading: 'Reading the file…',
        firstLoadNote: 'The processor is about 31 MB and loads only once.',
        browserProcessingNote: 'Processing in your browser',
        percent: '{{value}}%',
        fileSize: '{{size}}',
        minutesSeconds: '{{minutes}} min {{seconds}} sec',
        minutesSecondsEn: '{{minutes}} min {{seconds}} sec',
      },
      compressor: {
        title: 'Compress audio — Runs on your device',
        description: 'Compress audio in your browser without uploading the file to a server',
        eyebrow: 'AUDIO COMPRESSOR',
        heroTitleA: 'Make audio smaller',
        heroTitleB: 'without uploading',
        heroIntro: 'Turn a large audio file into a lighter M4A. Everything runs in your browser.',
        pointLocal: '100% on-device',
        pointAccount: 'No account needed',
        stepFile: '01 — Choose a file',
        sourceTitle: 'Original audio file',
        stepSettings: '02 — Voice quality',
        settingsTitle: 'Set the output file',
        bitrate: 'Bitrate',
        bitrate24: '24 kbps — Smallest',
        bitrate32: '32 kbps — Recommended',
        bitrate48: '48 kbps — Clearer',
        formatLabel: 'Format',
        formatValue: 'M4A / AAC',
        audioLabel: 'Audio',
        audioValue: 'Mono · 16 kHz',
        compressButton: 'Compress audio',
        loadingEncoder: 'Loading the encoder for the first time…',
        compressing: 'Compressing audio…',
        reading: 'Reading the file…',
        resultTitle: 'Your file is ready',
        download: 'Download M4A',
        resultSummary: '{{input}} → {{output}} · {{reduction}}% smaller',
        error: 'This file could not be compressed. Try the latest Chrome or Edge and make sure your device has enough memory.',
      },
      split: {
        title: 'Split audio — Runs on your device',
        description: 'Split audio into multiple parts in your browser without uploading the file',
        eyebrow: 'LOCAL AUDIO SPLITTER',
        heroTitleA: 'Split a large file',
        heroTitleB: 'into useful parts',
        heroIntro: 'Choose how many parts you need and download each one immediately. Everything runs in your browser.',
        stepFile: '01 — Choose a file',
        sourceTitle: 'Original audio file',
        stepCount: '02 — Set the count',
        countTitle: 'How many parts?',
        loadingDuration: 'Reading the file duration…',
        countLabel: 'Number of parts',
        countHint: '2–50 files',
        splitButton: 'Split audio',
        statusLoading: 'Loading the processor for the first time…',
        statusPreparing: 'Preparing the file…',
        statusPart: 'Splitting part {{current}} of {{total}}…',
        statusDone: 'Splitting complete',
        statusNote: 'The file is processed in your browser and is not uploaded anywhere.',
        estimate: 'About {{duration}} per file · {{size}} (based on the original file size)',
        resultsTitle: 'Split files — {{count}} parts',
        downloadAll: 'Download all .zip',
        packing: 'Packing .zip…',
        clearResults: 'Clear results',
        part: 'Part {{index}}',
        downloadPart: 'Download ↓',
        durationError: 'Could not read this file duration. Try M4A, MP3, or WAV.',
        splitError: 'Splitting failed. Try M4A, MP3, or WAV and make sure your device has enough memory.',
        zipError: 'Could not create the ZIP. Download each file separately or close other apps to free memory.',
        privacy: 'Files are not uploaded. There is no database or server file storage. If you plan to transcribe the parts, choose enough parts to keep each file under 4 MB.',
      },
      transcribe: {
        title: 'Transcribe — AI',
        description: 'Transcribe audio to text with AI. Files are limited to 4 MB.',
        eyebrow: 'AI TRANSCRIPTION',
        heroTitleA: 'Turn audio into',
        heroTitleB: 'ready-to-use text',
        heroIntro: 'Upload an audio file up to 4 MB and receive a transcript.',
        stepFile: '01 — Choose a file',
        sourceTitle: 'Audio file to transcribe',
        limit: '4 MB maximum',
        types: 'Supports M4A, MP3, WAV, AAC, OGG, and WebM · 4 MB maximum',
        stepStart: '02 — Start transcription',
        optionsTitle: 'Read text from the audio',
        optionsIntro: 'The original spoken language is preserved and paragraphs are formatted for readability.',
        button: 'Transcribe to text',
        statusSending: 'Sending the file for transcription…',
        statusSendingAi: 'Sending the file to AI…',
        statusAi: 'AI is transcribing…',
        statusDone: 'Transcription complete',
        progressLabel: 'Transcription progress',
        statusNote: 'Progress is approximate. Keep this page open until the result is ready.',
        resultTitle: 'Transcript',
        copy: 'Copy',
        copied: 'Copied',
        download: 'Download .md',
        dataTitle: 'Your data',
        privacy: 'This site has no database or file storage. Your selected file is sent through Netlify to AI in one request for transcription. Files must be under 4 MB for reliable delivery.',
        emptyFile: 'This file is empty. Please choose another audio file.',
        tooLarge: 'This file is {{size}}, which exceeds the 4 MB limit. Compress or split it first.',
        unavailable: 'Transcription is currently unavailable.',
        noText: 'The service did not return a transcript.',
        genericError: 'Something went wrong. Please try again.',
        copyError: 'Copying failed. Select the text from the result box manually.',
        markdownTitle: 'Transcript: {{name}}',
        ready: 'Ready to transcribe',
      },
    },
  };

  let language = null;
  try { language = localStorage.getItem('audio-tools-language'); } catch {}
  if (!translations[language]) language = (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'th';

  function getValue(key) {
    return key.split('.').reduce((value, part) => value?.[part], translations[language]) ?? key;
  }
  function t(key, values = {}) {
    return String(getValue(key)).replace(/\{\{(\w+)\}\}/g, (_, name) => values[name] ?? '');
  }
  function apply() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((node) => { node.setAttribute('aria-label', t(node.dataset.i18nAriaLabel)); });
    document.querySelectorAll('[data-i18n-title]').forEach((node) => { node.setAttribute('title', t(node.dataset.i18nTitle)); });
    const page = document.querySelector('[data-page]')?.dataset.page || document.body.dataset.page;
    if (page) {
      document.title = t(`${page}.title`);
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = t(`${page}.description`);
    }
    // Update language dropdowns
    document.querySelectorAll('.lang-dropdown').forEach((dropdown) => {
      const btn = dropdown.querySelector('.lang-dropdown-btn');
      const currentText = dropdown.querySelector('.current-lang-text');
      if (currentText) {
        currentText.textContent = language.toUpperCase();
      }
      if (btn) {
        btn.setAttribute('aria-label', language === 'th' ? 'เปลี่ยนภาษา (ปัจจุบัน: ภาษาไทย)' : 'Change language (Current: English)');
      }
      dropdown.querySelectorAll('.lang-option').forEach((opt) => {
        const isCurrent = opt.dataset.lang === language;
        opt.classList.toggle('active', isCurrent);
        opt.setAttribute('aria-selected', String(isCurrent));
      });
    });
    document.querySelectorAll('.language-toggle, #language-toggle').forEach((button) => {
      const label = button.querySelector('.lang-text');
      if (label) {
        label.textContent = t('common.languageButton');
      } else {
        button.textContent = t('common.languageButton');
      }
      button.setAttribute('aria-label', t('common.languageLabel'));
    });
    window.dispatchEvent(new CustomEvent('audio-tools-language-change', { detail: language }));
  }
  function setLanguage(next) { if (!translations[next]) return; language = next; try { localStorage.setItem('audio-tools-language', language); } catch {} apply(); }
  window.AudioI18n = { t, get language() { return language; }, setLanguage, formatDuration(seconds) { const minutes = Math.floor(seconds / 60); const remainder = Math.round(seconds % 60); return t('common.minutesSeconds', { minutes, seconds: remainder }); } };
  
  document.addEventListener('click', (e) => {
    // 1. Language dropdown toggle
    const dropdownBtn = e.target.closest('.lang-dropdown-btn');
    if (dropdownBtn) {
      const dropdown = dropdownBtn.closest('.lang-dropdown');
      const menu = dropdown?.querySelector('.lang-dropdown-menu');
      if (menu) {
        const willOpen = menu.hidden;
        document.querySelectorAll('.lang-dropdown-menu').forEach((m) => { m.hidden = true; });
        document.querySelectorAll('.lang-dropdown-btn').forEach((b) => { b.setAttribute('aria-expanded', 'false'); });
        
        menu.hidden = !willOpen;
        dropdownBtn.setAttribute('aria-expanded', String(willOpen));
      }
      return;
    }

    // 2. Language option selection
    const langOption = e.target.closest('.lang-option');
    if (langOption && langOption.dataset.lang) {
      setLanguage(langOption.dataset.lang);
      const menu = langOption.closest('.lang-dropdown-menu');
      if (menu) menu.hidden = true;
      const btn = langOption.closest('.lang-dropdown')?.querySelector('.lang-dropdown-btn');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
      return;
    }

    // 3. Click outside closes dropdown
    if (!e.target.closest('.lang-dropdown')) {
      document.querySelectorAll('.lang-dropdown-menu').forEach((m) => { m.hidden = true; });
      document.querySelectorAll('.lang-dropdown-btn').forEach((b) => { b.setAttribute('aria-expanded', 'false'); });
    }

    const toggleBtn = e.target.closest('.language-toggle, #language-toggle');
    if (toggleBtn) {
      setLanguage(language === 'th' ? 'en' : 'th');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.lang-dropdown-menu').forEach((m) => { m.hidden = true; });
      document.querySelectorAll('.lang-dropdown-btn').forEach((b) => { b.setAttribute('aria-expanded', 'false'); });
    }
  });

  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  if (menuToggle && mobileNav) {
    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean' ? open : mobileNav.hidden;
      mobileNav.hidden = !isOpen;
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.classList.toggle('is-active', isOpen);
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    document.addEventListener('click', (e) => {
      if (!mobileNav.hidden && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileNav.hidden) {
        toggleMenu(false);
      }
    });
  }

  apply();
})();
