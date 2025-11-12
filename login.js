/**
 * JCG Culture Material - Login System
 * 
 * ============================================
 * 許可ユーザー名の設定
 * ============================================
 * 以下の配列に許可するユーザー名を追加してください。
 * 例: const allowedUsers = ['user1', 'user2', 'user3'];
 */
const allowedUsers = [
    // ここに許可するユーザー名を追加してください
    // 例: 'student1',
    // 例: 'teacher1',
    'kairidaiho12@gmail.com',
];

/**
 * ============================================
 * 設定はここまで
 * ============================================
 */

// ローカルストレージのキー
const STORAGE_KEY = 'jcg_login_status';
const USERNAME_KEY = 'jcg_username';
const LANGUAGE_KEY = 'jcg_login_language';

// Googleフォーム設定
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdWK1V8AoeWlMdhh3UAjvcWYDKgthCbEiAPFlk51zKMF2ht_w/formResponse';
const GOOGLE_FORM_ENTRY_ID = 'entry.419914589';

// 多言語テキスト
const texts = {
    en: {
        title: 'ECG・JCG<br>Member-Only Content',
        subtitle: 'Please enter your username',
        usernameLabel: 'Username',
        usernamePlaceholder: 'Enter your email address',
        usernameNote: 'The email address registered on the member page is your username.',
        loginButton: 'Login',
        errorEmpty: 'Please enter your username.',
        errorInvalid: 'Username is incorrect.',
        switchToJapanese: '日本語'
    },
    ja: {
        title: 'ECG・JCG<br>会員専用コンテンツ',
        subtitle: 'ユーザー名を入力してください',
        usernameLabel: 'ユーザー名',
        usernamePlaceholder: 'メールアドレスを入力',
        usernameNote: '会員ページに登録されたメールアドレスがユーザーネームです。',
        loginButton: 'ログイン',
        errorEmpty: 'ユーザー名を入力してください。',
        errorInvalid: 'ユーザー名が正しくありません。',
        switchToEnglish: 'English'
    }
};

// 現在の言語を取得（デフォルトは英語）
function getCurrentLanguage() {
    return localStorage.getItem(LANGUAGE_KEY) || 'en';
}

// 言語を設定
function setLanguage(lang) {
    localStorage.setItem(LANGUAGE_KEY, lang);
}

// ログイン状態をチェック
function checkLoginStatus() {
    const loginStatus = localStorage.getItem(STORAGE_KEY);
    const username = localStorage.getItem(USERNAME_KEY);
    
    if (loginStatus === 'logged_in' && username) {
        // ユーザー名が許可リストにあるか再確認
        if (allowedUsers.includes(username)) {
            return true;
        } else {
            // 許可リストにない場合はログアウト
            logout();
            return false;
        }
    }
    return false;
}

// ログアウト（ローカルストレージをクリア）
function logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USERNAME_KEY);
}

// モーダルのテキストを更新
function updateModalTexts(lang) {
    const t = texts[lang];
    const titleEl = document.getElementById('login-title');
    const subtitleEl = document.getElementById('login-subtitle');
    const labelEl = document.getElementById('login-label');
    const inputEl = document.getElementById('username-input');
    const noteEl = document.getElementById('login-note');
    const buttonEl = document.getElementById('login-button');
    const langButtonEl = document.getElementById('login-lang-button');
    
    if (titleEl) titleEl.innerHTML = t.title; // innerHTMLで<br>タグを反映
    if (subtitleEl) subtitleEl.textContent = t.subtitle;
    if (labelEl) labelEl.textContent = t.usernameLabel;
    if (inputEl) inputEl.placeholder = t.usernamePlaceholder;
    if (noteEl) noteEl.textContent = t.usernameNote;
    if (buttonEl) buttonEl.textContent = t.loginButton;
    if (langButtonEl) {
        langButtonEl.textContent = lang === 'en' ? t.switchToJapanese : t.switchToEnglish;
        langButtonEl.setAttribute('data-lang', lang === 'en' ? 'ja' : 'en');
    }
}

// ログインモーダルを作成
function createLoginModal() {
    const currentLang = getCurrentLanguage();
    const t = texts[currentLang];
    
    // モーダルオーバーレイ
    const overlay = document.createElement('div');
    overlay.id = 'login-overlay';
    overlay.className = 'login-overlay';
    
    // モーダルコンテナ
    const modal = document.createElement('div');
    modal.className = 'login-modal';
    
    // モーダルコンテンツ
    modal.innerHTML = `
        <div class="login-modal-content">
            <button id="login-lang-button" class="login-lang-button" data-lang="${currentLang === 'en' ? 'ja' : 'en'}">
                ${currentLang === 'en' ? t.switchToJapanese : t.switchToEnglish}
            </button>
            <h2 id="login-title" class="login-title">${t.title}</h2>
            <p id="login-subtitle" class="login-subtitle">${t.subtitle}</p>
            <form id="login-form" class="login-form">
                <div class="login-input-group">
                    <label id="login-label" for="username-input">${t.usernameLabel}</label>
                    <input 
                        type="text" 
                        id="username-input" 
                        class="login-input" 
                        placeholder="${t.usernamePlaceholder}"
                        required
                        autocomplete="username"
                    >
                    <p id="login-note" class="login-note">${t.usernameNote}</p>
                </div>
                <div id="login-error" class="login-error" style="display: none;"></div>
                <button type="submit" id="login-button" class="login-button">${t.loginButton}</button>
            </form>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // 言語切り替えボタン
    const langButton = document.getElementById('login-lang-button');
    langButton.addEventListener('click', function(e) {
        e.preventDefault();
        const newLang = this.getAttribute('data-lang');
        setLanguage(newLang);
        updateModalTexts(newLang);
    });
    
    // フォーム送信処理
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('username-input');
    const errorDiv = document.getElementById('login-error');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const currentLang = getCurrentLanguage();
        const t = texts[currentLang];
        
        // エラーメッセージをクリア
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        
        // バリデーション
        if (!username) {
            showError(t.errorEmpty);
            return;
        }
        
        // 許可ユーザー名チェック
        if (!allowedUsers.includes(username)) {
            showError(t.errorInvalid);
            usernameInput.focus();
            return;
        }
        
        // ログイン成功
        loginSuccess(username);
    });
    
    // エラー表示関数
    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        usernameInput.classList.add('login-input-error');
        
        // エラー状態を解除（入力時）
        usernameInput.addEventListener('input', function() {
            usernameInput.classList.remove('login-input-error');
        }, { once: true });
    }
    
    // フォーカスを入力欄に
    setTimeout(() => {
        usernameInput.focus();
    }, 100);
}

// Googleフォームに送信
function submitToGoogleForm(username) {
    // フォームデータを作成
    const formData = new FormData();
    formData.append(GOOGLE_FORM_ENTRY_ID, username);
    
    // Googleフォームに送信（非同期、エラーは無視）
    fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors', // CORS回避
        body: formData
    }).catch(function(error) {
        // エラーは無視（no-corsモードではレスポンスを取得できないため）
        console.log('Google Form submission attempted');
    });
}

// ログイン成功処理
function loginSuccess(username) {
    // Googleフォームに送信
    submitToGoogleForm(username);
    
    // ローカルストレージに保存
    localStorage.setItem(STORAGE_KEY, 'logged_in');
    localStorage.setItem(USERNAME_KEY, username);
    
    // モーダルを削除
    const overlay = document.getElementById('login-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// ページ読み込み時に実行
(function() {
    // DOMが読み込まれた後に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLogin);
    } else {
        initLogin();
    }
    
    function initLogin() {
        // ログイン状態をチェック
        if (!checkLoginStatus()) {
            // 未ログインの場合はモーダルを表示
            createLoginModal();
        }
    }
})();

