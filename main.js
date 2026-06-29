/* ==========================================
   7 PEAKS IT & CYBERSECURITY SOLUTIONS
   Main Client Logic & Animations
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Header Scroll Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Nav Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      // Hamburger animation
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
      spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
      spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
    });
  }

  // 3. Mobile Dropdown Toggle
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  });

  // 4. Modal Triggers & Floating Menu
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalCloses = document.querySelectorAll('.modal-close');
  const inquiryOptions = document.querySelectorAll('.inquiry-option');
  
  // Show respective modals based on data-target click
  inquiryOptions.forEach(option => {
    option.addEventListener('click', () => {
      const targetId = option.getAttribute('data-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      }
    });
  });

  // Close modals
  modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  // Close modal when clicking outside
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  function closeAllModals() {
    modalOverlays.forEach(overlay => {
      overlay.classList.remove('active');
    });
    document.body.style.overflow = ''; // Unlock scrolling
  }

  // 5. Form Submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validations
      let valid = true;
      const inputs = form.querySelectorAll('.form-control');
      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#d90429';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!valid) {
        alert('Please fill out all required fields.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit';
      if (submitBtn) {
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;
      }

      // Construct form payload for Web3Forms
      const formData = new FormData(form);
      formData.append('access_key', '33eb2613-cdd7-4a8b-86f4-3d8d0960365e');
      formData.append('from_name', '7 Peaks IT Website');

      // Determine subject dynamically based on parent modal ID or form headers
      let subject = 'New Form Submission - 7 Peaks IT';
      const modal = form.closest('.modal-overlay');
      if (modal) {
        if (modal.id === 'modal-business') {
          subject = 'Business Inquiry - 7 Peaks IT';
        } else if (modal.id === 'modal-careers') {
          subject = 'Careers Application - 7 Peaks IT';
        } else if (modal.id === 'modal-training') {
          subject = 'Training/Internship Registration - 7 Peaks IT';
        }
      } else {
        const cardHeader = form.closest('.card') ? form.closest('.card').querySelector('h3') : null;
        const cardTitle = cardHeader ? cardHeader.innerText : '';
        if (cardTitle && cardTitle.includes('Message')) {
          subject = 'Contact Form Message - 7 Peaks IT';
        }
      }
      formData.append('subject', subject);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Thank you for contacting 7 Peaks IT! We have received your inquiry and will respond shortly.');
          form.reset();
          closeAllModals();
        } else {
          alert('Something went wrong: ' + (data.message || 'Please try again later.'));
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please check your network connection and try again.');
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.innerText = originalBtnText;
          submitBtn.disabled = false;
        }
      });
    });
  });

  // 6. Stats Counter Animation
  const statsSection = document.querySelector('.stats-sec');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statsSection && statNumbers.length > 0) {
    let animated = false;
    
    const countUp = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(target)) return; // Skip non-numeric values like "24/7"
      
      let count = 0;
      const duration = 1500; // 1.5 seconds animation
      const frameRate = 1000 / 60; // 60 fps
      const totalFrames = Math.round(duration / frameRate);
      let frame = 0;
      
      const updateCount = () => {
        frame++;
        const progress = frame / totalFrames;
        // Ease-out quad progress curve
        const easeProgress = progress * (2 - progress);
        count = target * easeProgress;
        
        if (frame < totalFrames) {
          el.innerText = Math.floor(count).toLocaleString() + '+';
          requestAnimationFrame(updateCount);
        } else {
          el.innerText = target.toLocaleString() + '+';
        }
      };
      
      requestAnimationFrame(updateCount);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          statNumbers.forEach(num => countUp(num));
          animated = true;
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(statsSection);
  }

  // 7. Interactive Cyber Terminal Typing Animation
  const terminalBody = document.querySelector('.terminal-body');
  if (terminalBody) {
    const lines = [
      { text: 'visitor@7peaksit:~# ', type: 'input' },
      { text: 'nmap -sV -T4 7peaksit.com', type: 'command' },
      { text: 'Starting Nmap 9.00 ( https://nmap.org ) at 2026-06-28 18:12', type: 'output' },
      { text: 'Scanning 7peaksit.com (192.168.100.9)...', type: 'output' },
      { text: 'PORT    STATE SERVICE  VERSION', type: 'output' },
      { text: '22/tcp  open  ssh      OpenSSH 8.2p1 (Security Warning: Weak MACs)', type: 'warning' },
      { text: '80/tcp  open  http     nginx 1.18.0 (Redirecting to HTTPS)', type: 'output' },
      { text: '443/tcp open  ssl/http nginx 1.18.0 (Security Status: Hardened)', type: 'success' },
      { text: 'visitor@7peaksit:~# ', type: 'input' },
      { text: 'cyber-harden --apply-policies --verbose', type: 'command' },
      { text: '[+] Deploying deep file inspection policies...', type: 'output' },
      { text: '[+] Hardening server daemons & rotating ciphers...', type: 'output' },
      { text: '[+] Re-routing network boundaries through advanced WAF...', type: 'output' },
      { text: '[SUCCESS] Core perimeter fully hardened. Threat vectors sealed. ⚡', type: 'success' },
      { text: 'visitor@7peaksit:~# systemctl status security-daemon', type: 'input' },
      { text: '● security-daemon.service - 24/7 Active Monitoring System', type: 'output' },
      { text: '   Active: active (running) since Sun 2026-06-28; status: SECURED', type: 'success' }
    ];

    let currentLine = 0;
    let currentChar = 0;
    let currentElement = null;

    const typeWriter = () => {
      if (currentLine >= lines.length) {
        // Restart terminal loop after a brief delay
        setTimeout(() => {
          terminalBody.innerHTML = '';
          currentLine = 0;
          currentChar = 0;
          currentElement = null;
          typeWriter();
        }, 5000);
        return;
      }

      const line = lines[currentLine];
      
      if (!currentElement) {
        currentElement = document.createElement('div');
        currentElement.className = 'terminal-line';
        if (line.type === 'input') {
          currentElement.innerHTML = `<span class="term-input">${line.text}</span>`;
          terminalBody.appendChild(currentElement);
          terminalBody.scrollTop = terminalBody.scrollHeight;
          currentLine++;
          currentElement = null;
          setTimeout(typeWriter, 500);
          return;
        } else if (line.type === 'command') {
          currentElement.innerHTML = `<span class="term-input">visitor@7peaksit:~# </span><span class="term-command"></span>`;
          terminalBody.appendChild(currentElement);
          terminalBody.scrollTop = terminalBody.scrollHeight;
        } else {
          let classType = 'term-output';
          if (line.type === 'success') classType = 'term-success';
          if (line.type === 'warning') classType = 'term-warning';
          if (line.type === 'error') classType = 'term-error';
          
          currentElement.innerHTML = `<span class="${classType}">${line.text}</span>`;
          terminalBody.appendChild(currentElement);
          terminalBody.scrollTop = terminalBody.scrollHeight;
          currentLine++;
          currentElement = null;
          setTimeout(typeWriter, 400);
          return;
        }
      }

      if (line.type === 'command') {
        const cmdSpan = currentElement.querySelector('.term-command');
        if (currentChar < line.text.length) {
          cmdSpan.textContent += line.text.charAt(currentChar);
          currentChar++;
          setTimeout(typeWriter, 40);
        } else {
          currentLine++;
          currentChar = 0;
          currentElement = null;
          setTimeout(typeWriter, 600);
        }
      }
    };

    typeWriter();
  }

  // 8. Service Tab Switcher Logic
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const activeContent = document.getElementById(targetId);
        if (activeContent) {
          activeContent.classList.add('active');
        }
      });
    });
  }

  // 9. Cybersecurity Readiness Audit Score Calculator
  const auditCheckboxes = document.querySelectorAll('.audit-checkbox');
  const auditResultBox = document.querySelector('.audit-result-box');
  const auditScoreTitle = document.querySelector('.audit-score-title');
  const auditRecommendation = document.querySelector('.audit-recommendation');
  
  if (auditCheckboxes.length > 0 && auditResultBox) {
    const calculateRisk = () => {
      let checkedCount = 0;
      auditCheckboxes.forEach(cb => {
        if (cb.checked) checkedCount++;
      });
      
      if (checkedCount === 5) {
        auditResultBox.style.borderTopColor = '#10b981'; // Green
        auditScoreTitle.innerHTML = '<span style="color: #10b981;">Low Risk (Optimal Security Status)</span>';
        auditRecommendation.innerText = 'Your digital infrastructure meets key compliance standard criteria. We recommend scheduling bi-annual penetration tests to identify zero-day vulnerabilities.';
      } else if (checkedCount >= 3) {
        auditResultBox.style.borderTopColor = '#f59e0b'; // Yellow
        auditScoreTitle.innerHTML = '<span style="color: #f59e0b;">Medium Risk (Workload Gaps Detected)</span>';
        auditRecommendation.innerText = 'Your security architecture satisfies baseline standards but has exposed threat avenues. We recommend deploying active WAF protection and structuring SSDLC consulting.';
      } else {
        auditResultBox.style.borderTopColor = '#ef4444'; // Red
        auditScoreTitle.innerHTML = '<span style="color: #ef4444;">High Risk (Critical Vulnerabilities Exposed)</span>';
        auditRecommendation.innerText = 'Critical compliance and infrastructure boundaries are missing. Immediate hardening, patch scheduling, and PMP-managed security deployments are highly recommended.';
      }
    };
    
    auditCheckboxes.forEach(cb => {
      cb.addEventListener('change', calculateRisk);
    });
    
    // Initial call
    calculateRisk();
  }
});
