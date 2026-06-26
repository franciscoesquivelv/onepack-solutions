/* ========================================
   ONEPACK SOLUTIONS - SUBPAGE FAQ ACCORDION
   (loaded on pallets, pooling, palletless, insumos)
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  const questions = document.querySelectorAll('.faq-question');

  // Wire up ARIA relationships once (button <-> answer panel)
  questions.forEach((btn, i) => {
    const answer = btn.nextElementSibling;
    if (!answer) return;

    if (!btn.id) btn.id = `faq-q-${i + 1}`;
    if (!answer.id) answer.id = `faq-a-${i + 1}`;

    btn.setAttribute('aria-controls', answer.id);
    if (!btn.hasAttribute('aria-expanded')) btn.setAttribute('aria-expanded', 'false');
    answer.setAttribute('role', 'region');
    answer.setAttribute('aria-labelledby', btn.id);
  });

  // Accordion behaviour
  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const answer   = btn.nextElementSibling;

      // Close all
      questions.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        if (b.nextElementSibling) b.nextElementSibling.classList.remove('open');
      });

      // Open this one if it was closed
      if (!expanded && answer) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

});
