/**
 * Popup Module
 * 
 * Manages the overlay modal for Traffic Signs.
 * Functionality:
 * 1. Popup Display: Shows sign image, title, and description.
 * 2. Quiz Interface: Handles Multiple Choice Questions (MCQ).
 * 3. Score Processing: Validates answers and updates mastery state.
 * 4. Control Flow: Pauses/Resumes mouse pointer lock when opening/closing.
 */

import { controls } from '../core/controls.js';
import { quizData, SIGN_IDS } from '../data/quizData.js';
import { signPopupInfo } from '../data/signData.js';
import { updateHud, updateMissionBox, updateSignChecklist } from './hud.js';

// Global State
export let currentSignId = null;
export let isPopupOpen = false;

// Score & Progress Tracking
// signScores[id] = integer point value
// signStates[id] = boolean (true if mastered)
export const signScores = {};
export const signStates = {};

// Initialize states for all signs to false (unlearned)
SIGN_IDS.forEach((id) => (signStates[id] = false));

/**
 * Check if popup is currently open
 */
export function getIsPopupOpen() {
    return isPopupOpen;
}

/**
 * Open sign popup
 */
export function openSignPopup(id) {
    // Release pointer lock
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }

    isPopupOpen = true;
    currentSignId = id;

    const popup = document.getElementById("signPopup");
    const overlay = document.getElementById("popupOverlay");
    const title = document.getElementById("popupTitle");
    const desc = document.getElementById("popupDesc");
    const img = document.getElementById("popupImage");
    const quizArea = document.getElementById("quizArea");

    // Reset state
    quizArea.style.display = "none";
    img.style.display = "block";
    desc.style.display = "block";
    document.getElementById("startQuiz").style.display = "block";

    // Set content based on ID
    const info = signPopupInfo[id];
    if (info) {
        title.innerText = info.title;
        desc.innerText = info.desc;
        img.src = info.img;
    } else {
        title.innerText = "Rambu Lalu Lintas";
        desc.innerText = "Informasi detail untuk rambu ini belum tersedia.";
        img.src = "images/rambu_parking.png";
    }

    popup.style.display = "flex";
    overlay.style.display = "block";
}

/**
 * Hide popup and return to game
 */
export function hidePopup() {
    const popup = document.getElementById("signPopup");
    const overlay = document.getElementById("popupOverlay");
    const quizArea = document.getElementById("quizArea");

    popup.style.display = "none";
    overlay.style.display = "none";
    quizArea.style.display = "none";

    isPopupOpen = false;
    currentSignId = null;

    // Re-lock pointer
    if (controls && !controls.isLocked) {
        controls.lock();
    }
}

/**
 * Start quiz for a sign
 */
export function startQuiz(id) {
    const quizArea = document.getElementById("quizArea");

    // Hide info
    document.getElementById("popupDesc").style.display = "none";
    document.getElementById("popupImage").style.display = "none";
    document.getElementById("startQuiz").style.display = "none";

    quizArea.style.display = "block";

    const data = quizData[id];
    if (!data) {
        quizArea.innerHTML = "<p>Data kuis belum tersedia.</p>";
        return;
    }

    let html = `<div style="text-align:left; max-height:300px; overflow-y:auto;">`;
    data.forEach((item, index) => {
        html += `<div style="margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #ccc;">
      <p style="margin:4px 0;"><b>${index + 1}. ${item.q}</b></p>`;

        item.a.forEach((ans, aIdx) => {
            html += `
       <label style="font-weight:normal;">
         <input type="radio" name="q_${id}_${index}" value="${aIdx}"> ${ans}
       </label>`;
        });
        html += `</div>`;
    });

    html += `</div>
  <button class="btn" id="checkAnswerBtn" style="background:#28a745; margin-top:10px; width:100%;">Cek Jawaban</button>`;

    quizArea.innerHTML = html;

    // Add click handler
    document.getElementById("checkAnswerBtn").addEventListener("click", () => {
        finishQuiz(id);
    });
}

/**
 * Finish quiz and show results
 */
export function finishQuiz(id) {
    const data = quizData[id];
    if (!data) return;

    let correct = 0;
    const userAnswers = [];

    // Check answers
    data.forEach((item, index) => {
        const radios = document.getElementsByName(`q_${id}_${index}`);
        let val = -1;
        for (const r of radios) {
            if (r.checked) {
                val = parseInt(r.value);
                break;
            }
        }
        userAnswers.push(val);
        if (val === item.c) correct++;
    });

    // Update scores (2 points per correct answer)
    signScores[id] = correct * 2;

    // Mark as mastered if all correct
    if (correct === data.length) {
        signStates[id] = true;
    }

    // Update UI
    updateHud(signScores);
    updateMissionBox(signStates);
    updateSignChecklist(signStates);

    // Show results
    const quizArea = document.getElementById("quizArea");
    let html = `
    <h3 style="margin-top:0;">Hasil Kuis</h3>
    <p style="margin-bottom:12px;">
      Benar <b>${correct}</b> dari <b>${data.length}</b> soal.
    </p>
    <div style="max-height:260px; overflow:auto; border:1px solid #eee; padding:8px;">
  `;

    data.forEach((item, index) => {
        const ans = userAnswers[index];
        const isCorrect = ans === item.c;
        const userStr = ans >= 0 ? item.a[ans] : "(Tidak dijawab)";

        html += `<div style="margin-bottom:10px; font-size:14px;">
       <b>${index + 1}. ${item.q}</b><br>
       <span style="color:${isCorrect ? 'green' : 'red'}">
         Jawab: ${userStr} ${isCorrect ? '✅' : '❌'}
       </span>
       ${!isCorrect ? `<br><small style="color:#555">Kunci: ${item.a[item.c]}</small>` : ''}
     </div>`;
    });

    html += `</div>
  <button class="btn" id="backToInfoBtn" style="background:#007bff; color:white; margin-top:14px; width:100%;">Kembali ke Info</button>
  `;

    quizArea.innerHTML = html;

    // Add back button handler
    document.getElementById("backToInfoBtn").addEventListener("click", () => {
        document.getElementById("popupImage").style.display = "block";
        document.getElementById("popupDesc").style.display = "block";
        document.getElementById("startQuiz").style.display = "block";
        quizArea.style.display = "none";
    });
}

/**
 * Initialize popup event handlers
 */
export function initPopupHandlers() {
    // Close button
    document.getElementById("closePopup").addEventListener("click", hidePopup);

    // Start quiz button
    document.getElementById("startQuiz").addEventListener("click", () => {
        if (currentSignId) startQuiz(currentSignId);
    });

    // Ensure popup is hidden initially
    const popup = document.getElementById("signPopup");
    const overlay = document.getElementById("popupOverlay");
    if (popup) popup.style.display = "none";
    if (overlay) overlay.style.display = "none";
}
