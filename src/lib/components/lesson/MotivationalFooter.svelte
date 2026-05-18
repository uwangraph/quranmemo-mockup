<script>
    let { isChecked, isCorrect, feedbackAnimClass, currentMotivation } = $props();
</script>

{#if isChecked}
    <div class="sliding-feedback-panel {feedbackAnimClass}" class:correct={isCorrect} class:wrong={!isCorrect}>
        <div class="feedback-inner-content">
            <div class="feedback-badge" class:correct={isCorrect} class:wrong={!isCorrect}>
                <i class="ti {isCorrect ? 'ti-check' : 'ti-alert-circle'}"></i>
                {isCorrect ? currentMotivation || 'SANGAT BAGUS! 🌟' : 'KURANG TEPAT 💪'}
            </div>
            <p class="feedback-msg">
                {isCorrect 
                    ? 'Masya Allah! Jawabanmu 100% tepat. Hafalan tajwid dan visualmu makin kokoh!' 
                    : 'Perhatikan susunan kata dan lafal aslinya. Jangan menyerah, ayo coba lagi!'}
            </p>
        </div>
    </div>
{/if}

<style>
    .sliding-feedback-panel {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 80px;
        background: #fff;
        border-top: 2px solid #e2e8f0;
        padding: 16px;
        z-index: 100;
        animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .sliding-feedback-panel.correct { background: #dcfce7; border-top-color: #22c55e; }
    .sliding-feedback-panel.wrong { background: #fee2e2; border-top-color: #ff4b4b; }
    
    .feedback-inner-content {
        max-width: 480px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .feedback-badge {
        font-size: 13px;
        font-weight: 900;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .feedback-badge.correct { color: #166534; }
    .feedback-badge.wrong { color: #991b1b; }
    
    .feedback-msg {
        font-size: 11px;
        font-weight: 700;
        color: #4b5563;
        margin: 0;
        line-height: 1.4;
    }
    
    @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
    }

    /* ============================================
       ANIMASI CORRECT - Confetti + Glow + Bounce
    ============================================ */
    :global(.sliding-feedback-panel.anim-correct) {
        animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                   correctFlash 0.6s ease-out !important;
    }
    :global(.sliding-feedback-panel.anim-correct) .feedback-badge {
        animation: badgeBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }

    @keyframes correctFlash {
        0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        30%  { box-shadow: 0 0 0 12px rgba(34, 197, 94, 0.35); }
        60%  { box-shadow: 0 0 0 24px rgba(34, 197, 94, 0.15); }
        100% { box-shadow: 0 0 0 32px rgba(34, 197, 94, 0); }
    }

    @keyframes badgeBounce {
        0%   { transform: scale(0.3) translateY(8px); opacity: 0; }
        50%  { transform: scale(1.3) translateY(-4px); opacity: 1; }
        75%  { transform: scale(0.9) translateY(2px); }
        100% { transform: scale(1) translateY(0); }
    }

    /* ============================================
       ANIMASI WRONG - Screen Shake + Red Pulse
    ============================================ */
    :global(.sliding-feedback-panel.anim-wrong) {
        animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                   wrongPulse 0.5s ease-out !important;
    }
    :global(.sliding-feedback-panel.anim-wrong) .feedback-badge {
        animation: badgeWobble 0.5s ease-out !important;
    }

    @keyframes wrongPulse {
        0%   { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        30%  { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0.4); }
        70%  { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0.15); }
        100% { box-shadow: 0 0 0 28px rgba(239, 68, 68, 0); }
    }

    @keyframes badgeWobble {
        0%   { transform: translateX(0); }
        15%  { transform: translateX(-8px) rotate(-3deg); }
        30%  { transform: translateX(7px) rotate(3deg); }
        45%  { transform: translateX(-6px) rotate(-2deg); }
        60%  { transform: translateX(5px) rotate(2deg); }
        75%  { transform: translateX(-3px); }
        100% { transform: translateX(0); }
    }
</style>
