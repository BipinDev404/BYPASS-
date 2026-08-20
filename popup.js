const $ = id => document.getElementById(id);
let unlocked = false;

// Mock chrome.storage.local if not running in extension
if (typeof chrome === 'undefined' || !chrome.storage) {
  window.chrome = window.chrome || {};
  window.chrome.storage = {
    local: {
      get: function(keys, callback) {
        let result = {};
        keys.forEach(key => {
          const val = localStorage.getItem('chrome_storage_' + key);
          if (val) {
            try {
              result[key] = JSON.parse(val);
            } catch (e) {
              result[key] = val;
            }
          }
        });
        setTimeout(() => callback(result), 0);
      },
      set: function(items, callback) {
        for (const [key, value] of Object.entries(items)) {
          localStorage.setItem('chrome_storage_' + key, JSON.stringify(value));
        }
        if (callback) setTimeout(callback, 0);
      }
    }
  };
}

// Theme Toggle Logic
const savedTheme = localStorage.getItem('bypass-theme') || 'dark';
if (savedTheme === 'light') {
  document.body.classList.add('light-theme');
  $('icon-moon').style.display = 'none';
  $('icon-sun').style.display = 'block';
}

$('theme-toggle').onclick = () => {
  const isLight = document.body.classList.toggle('light-theme');
  if (isLight) {
    localStorage.setItem('bypass-theme', 'light');
    $('icon-moon').style.display = 'none';
    $('icon-sun').style.display = 'block';
  } else {
    localStorage.setItem('bypass-theme', 'dark');
    $('icon-moon').style.display = 'block';
    $('icon-sun').style.display = 'none';
  }
};

function attemptUnlock() {
  if ($('master').value === 'h@cker') {
    unlocked = true;
    $('unlock-section').style.display = 'none';
    $('vault-section').style.display = 'block';
    load();
  } else {
    $('error-msg').style.display = 'block';
  }
}

$('unlock').onclick = attemptUnlock;

$('master').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    attemptUnlock();
  }
});

// How to use logic
if ($('how-to-use-link')) {
  $('how-to-use-link').onclick = (e) => {
    e.preventDefault();
    $('unlock-section').style.display = 'none';
    $('how-to-use-section').style.display = 'block';
  };
}

if ($('back-to-login')) {
  $('back-to-login').onclick = () => {
    $('how-to-use-section').style.display = 'none';
    $('unlock-section').style.display = 'flex';
  };
}

$('toggle-add').onclick = () => {
  const form = $('add-form');
  const btn = $('toggle-add');
  if (form.style.display === 'none') {
    form.style.display = 'block';
    btn.innerText = 'Cancel ';
    btn.classList.remove('primary');
  } else {
    form.style.display = 'none';
    btn.innerText = 'New Password + ';
    btn.classList.add('primary');
  }
};

$('gen').onclick = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let p = ''; 
  for (let i = 0; i < 16; i++) p += chars[Math.floor(Math.random() * chars.length)];
  $('pass').value = p;
};

$('save').onclick = () => {
  if (!unlocked) return;
  const name = $('name').value.trim();
  const user = $('user').value.trim();
  const pass = $('pass').value.trim();
  
  if (!name || !user || !pass) return alert('Fill all fields');

  chrome.storage.local.get(['vault'], r => {
    const v = r.vault || [];
    v.push({ id: Date.now(), name, user, pass });
    chrome.storage.local.set({ vault: v }, () => {
      $('name').value = '';
      $('user').value = '';
      $('pass').value = '';
      $('add-form').style.display = 'none';
      $('toggle-add').innerText = '+ Add New Password';
      $('toggle-add').classList.add('primary');
      load();
    });
  });
};

function renderList(items) {
  const ul = $('list'); 
  ul.innerHTML = '';
  
  items.forEach(e => {
    // Generate best-guess domain for the icon
    const domain = e.name.toLowerCase().replace(/\s+/g, '') + '.com';
    
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="li-header">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <img src="https://icons.duckduckgo.com/ip3/${domain}.ico" width="18" height="18" style="background: rgba(255,255,255,0.8); border-radius: 4px; padding: 2px;" onerror="this.style.display='none'">
          <span class="li-name">${e.name}</span>
          <span style="color: #666; font-size: 14px; margin: 0 4px;">|</span>
          <span class="li-user" style="margin-top: 0;">${e.user}</span>
        </div>
      </div>
      <div class="actions">
        <button class="copy-btn" data-pass="${e.pass}">
          <svg style="vertical-align: middle; margin-right: 4px;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Copy
        </button>
        <button class="btn-del" data-id="${e.id}">
          <svg style="vertical-align: middle; margin-right: 4px;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Delete
        </button>
      </div>
    `;
    ul.appendChild(li);
  });

  // Attach Copy events
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.onclick = (event) => {
      navigator.clipboard.writeText(event.target.dataset.pass);
      const original = event.target.innerText;
      event.target.innerText = 'Copied!';
      setTimeout(() => event.target.innerText = original, 1200);
    };
  });

  // Attach Delete events
  document.querySelectorAll('.btn-del').forEach(btn => {
    btn.onclick = (event) => {
      const id = parseInt(event.target.dataset.id);
      chrome.storage.local.get(['vault'], r => {
        const v = (r.vault || []).filter(x => x.id !== id);
        chrome.storage.local.set({ vault: v }, load);
      });
    };
  });
}

function load() {
  chrome.storage.local.get(['vault'], r => renderList(r.vault || []));
}

$('search').oninput = e => {
  const q = e.target.value.toLowerCase();
  chrome.storage.local.get(['vault'], r => {
    const filtered = (r.vault || []).filter(x => 
      x.name.toLowerCase().includes(q) || x.user.toLowerCase().includes(q)
    );
    renderList(filtered);
  });
};

$('export-btn').onclick = () => {
  if (!unlocked) return;
  chrome.storage.local.get(['vault'], r => {
    const v = r.vault || [];
    if (v.length === 0) return alert('Vault is empty!');
    
    // Create JSON blob
    const dataStr = JSON.stringify(v, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `bypass_vault_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); // Firefox requirement
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
};