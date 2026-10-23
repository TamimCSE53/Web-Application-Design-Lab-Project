(() => {
    const pageRoutes = new Set([
        'hero.html',
        'candidates.html',
        'comapines.html',
        'contact.html',
        'extra.html',
        'helptab.html',
        'postjob1.html',
        'postjob2.html',
        'signup.html'
    ]);
    const routesByLabel = {
        home: 'hero.html',
        jobpress: 'hero.html',
        about: 'hero.html#about',
        company: 'comapines.html',
        'our partners': 'comapines.html',
        'browse candidates': 'candidates.html',
        candidates: 'candidates.html',
        'browse companies': 'comapines.html',
        companies: 'comapines.html',
        'job listing': 'hero.html#latest-jobs',
        'browse jobs': 'hero.html#latest-jobs',
        'browse job': 'hero.html#latest-jobs',
        'job details': 'hero.html#latest-jobs',
        'job categories': 'hero.html#categories',
        'post a resume': 'extra.html',
        'submit resume': 'extra.html',
        'candidate dashboard': 'signup.html',
        'company dashboard': 'postjob2.html',
        'employer dashboard': 'postjob2.html',
        'post a job': 'postjob1.html',
        'add a job': 'postjob1.html',
        'pricing plans': 'postjob1.html',
        pricing: 'postjob1.html',
        packages: 'postjob1.html',
        'need help?': 'helptab.html',
        'help center': 'helptab.html',
        faq: 'helptab.html',
        'how it works': 'helptab.html',
        'contact us': 'contact.html',
        contact: 'contact.html',
        'log in': 'signup.html',
        login: 'signup.html',
        'sign up': 'extra.html',
        'privacy policy': 'helptab.html',
        'terms of service': 'helptab.html',
        conditions: 'helptab.html',
        team: 'candidates.html'
    };
    const statusMessage = (anchor, text) => {
        let status = anchor.parentElement.querySelector('.site-status');
        if (!status) {
            status = document.createElement('p');
            status.className = 'site-status';
            status.setAttribute('role', 'status');
            anchor.insertAdjacentElement('afterend', status);
        }
        status.textContent = text;
    };

    const siteStyles = document.createElement('link');
    siteStyles.rel = 'stylesheet';
    siteStyles.href = 'site.css';
    document.head.append(siteStyles);

    document.querySelectorAll('img[src], link[href]').forEach((element) => {
        const attribute = element.tagName === 'IMG' ? 'src' : 'href';
        const value = element.getAttribute(attribute);
        if (value?.startsWith('/')) {
            element.setAttribute(attribute, value.replace(/^\/(?:Files\/)?/i, ''));
        }
    });

    document.querySelectorAll('a[href]').forEach((anchor) => {
        const label = anchor.textContent.trim().replace(/\s+/g, ' ').toLowerCase();
        if (anchor.matches('[data-bs-toggle]') || anchor.closest('.alpha')) return;

        const href = anchor.getAttribute('href');
        const localPath = href.replace(/^\/(?:Files\/)?/i, '').toLowerCase();
        if (pageRoutes.has(localPath)) {
            anchor.setAttribute('href', localPath);
            return;
        }

        if (href.startsWith('#') && href.length > 1 && document.getElementById(href.slice(1))) return;

        const route = routesByLabel[label];
        if (route) {
            anchor.setAttribute('href', route);
        } else if (anchor.closest('.navbar') && label === 'blog') {
            anchor.closest('.nav-item')?.remove();
        } else if (href === '#' || href === '#!' || href.startsWith('/')) {
            anchor.removeAttribute('href');
            anchor.setAttribute('aria-disabled', 'true');
            anchor.tabIndex = -1;
            anchor.classList.add('site-unavailable');
        }
    });

    document.querySelectorAll('.battan button').forEach((button) => {
        if (button.closest('a')) return;
        const route = routesByLabel[button.textContent.trim().toLowerCase()];
        if (route) button.addEventListener('click', () => window.location.assign(route));
    });

    document.querySelectorAll('.navbar-toggler[data-bs-target]').forEach((toggle) => {
        const target = document.getElementById(toggle.getAttribute('data-bs-target').slice(1));
        if (!target) return;
        toggle.removeAttribute('data-bs-toggle');
        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            target.classList.toggle('show', !expanded);
        });
    });

    const dropdownTriggers = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownTriggers.forEach((trigger) => {
        trigger.removeAttribute('data-bs-toggle');
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const menu = trigger.closest('.dropdown')?.querySelector('.dropdown-menu');
            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            dropdownTriggers.forEach((otherTrigger) => {
                otherTrigger.setAttribute('aria-expanded', 'false');
                otherTrigger.closest('.dropdown')?.querySelector('.dropdown-menu')?.classList.remove('show');
            });
            trigger.setAttribute('aria-expanded', String(!expanded));
            menu?.classList.toggle('show', !expanded);
        });
    });
    document.addEventListener('click', (event) => {
        if (event.target.closest('.dropdown')) return;
        dropdownTriggers.forEach((trigger) => {
            trigger.setAttribute('aria-expanded', 'false');
            trigger.closest('.dropdown')?.querySelector('.dropdown-menu')?.classList.remove('show');
        });
    });

    const revealTargets = document.querySelectorAll('.can1, .comli1, .box, .prd-1, .card, .readmore');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('site-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        revealTargets.forEach((element) => {
            element.classList.add('site-reveal');
            revealObserver.observe(element);
        });
    } else {
        revealTargets.forEach((element) => element.classList.add('site-revealed'));
    }

    const jobSearch = document.querySelector('.search-box');
    const jobSearchButton = document.querySelector('.search-button');
    const jobCards = [...document.querySelectorAll('.latest-jobs-container .card')];
    if (jobSearch && jobSearchButton && jobCards.length) {
        const runJobSearch = () => {
            const query = jobSearch.value.trim().toLowerCase();
            let matches = 0;
            jobCards.forEach((card) => {
                const visible = !query || card.textContent.toLowerCase().includes(query);
                card.hidden = !visible;
                if (visible) matches += 1;
            });
            statusMessage(jobSearchButton, query ? `${matches} matching job${matches === 1 ? '' : 's'}.` : 'Showing all jobs.');
            document.querySelector('#latest-jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        jobSearch.setAttribute('aria-label', 'Search jobs');
        jobSearch.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                runJobSearch();
            }
        });
        jobSearchButton.addEventListener('click', runJobSearch);
    }

    const candidateCards = [...document.querySelectorAll('.whole .ch2 .can1')];
    const candidateFilters = [...document.querySelectorAll('.whole .sub2 input')];
    if (candidateCards.length && candidateFilters.length >= 2) {
        const candidateList = document.querySelector('.whole .ch2');
        const filterStatus = document.createElement('p');
        filterStatus.className = 'site-status';
        filterStatus.setAttribute('role', 'status');
        candidateList.before(filterStatus);
        const applyCandidateFilters = () => {
            const location = candidateFilters[0].value.trim().toLowerCase();
            const skill = candidateFilters[1].value.trim().toLowerCase();
            let matches = 0;
            candidateCards.forEach((card) => {
                const text = card.textContent.toLowerCase();
                const visible = (!location || text.includes(location)) && (!skill || text.includes(skill));
                card.hidden = !visible;
                if (visible) matches += 1;
            });
            filterStatus.textContent = `${matches} candidate${matches === 1 ? '' : 's'} shown`;
        };
        candidateFilters.forEach((input) => input.addEventListener('input', applyCandidateFilters));
        document.querySelectorAll('.whole .fullch button').forEach((button) => {
            button.addEventListener('click', () => {
                candidateFilters[1].value = button.textContent.trim();
                applyCandidateFilters();
            });
        });
        document.querySelector('.whole .sub1 .secdiv select')?.addEventListener('change', (event) => {
            const direction = event.target.value.toLowerCase();
            if (!direction.includes('alphabetically')) return;
            const sorted = [...candidateCards].sort((first, second) => {
                const order = first.querySelector('h3').textContent.localeCompare(second.querySelector('h3').textContent);
                return direction.endsWith('z-a') ? -order : order;
            });
            sorted.forEach((card) => candidateList.append(card));
        });
    }

    const companyGroups = [...document.querySelectorAll('.purata .comli1')];
    const alphabetLinks = [...document.querySelectorAll('.purata .alpha a')];
    if (companyGroups.length && alphabetLinks.length) {
        const applyCompanyLetter = (letter) => {
            companyGroups.forEach((group) => {
                const heading = group.querySelector('.p')?.textContent.trim().toLowerCase() ?? '';
                group.hidden = Boolean(letter) && !heading.startsWith(`${letter.toLowerCase()} `);
            });
            document.querySelectorAll('.purata .comli').forEach((row) => {
                row.hidden = !row.querySelector('.comli1:not([hidden])');
            });
        };
        alphabetLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const letter = link.textContent.trim();
                const active = link.getAttribute('aria-current') === 'true';
                alphabetLinks.forEach((item) => item.removeAttribute('aria-current'));
                if (active) {
                    applyCompanyLetter('');
                } else {
                    link.setAttribute('aria-current', 'true');
                    applyCompanyLetter(letter);
                }
            });
        });
    }

    const contactForm = document.querySelector('.form_p form');
    if (contactForm) {
        ['name', 'email', 'message'].forEach((id) => {
            const field = contactForm.querySelector(`#${id}`);
            if (field) field.required = true;
        });
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            statusMessage(contactForm.querySelector('button[type="submit"]'), 'Thanks. Your message is ready, but sending requires a server connection.');
            contactForm.reset();
        });
    }

    const registrationForm = document.querySelector('.cont2 form');
    if (registrationForm) {
        const password = registrationForm.querySelector('[name="password"]');
        const confirmation = registrationForm.querySelector('[name="confirm-password"]');
        const updatePasswordValidity = () => {
            confirmation.setCustomValidity(password.value === confirmation.value ? '' : 'Passwords must match.');
        };
        password.addEventListener('input', updatePasswordValidity);
        confirmation.addEventListener('input', updatePasswordValidity);
        registrationForm.addEventListener('submit', (event) => {
            updatePasswordValidity();
            if (!registrationForm.reportValidity()) {
                event.preventDefault();
                return;
            }
            event.preventDefault();
            statusMessage(registrationForm.querySelector('button[type="submit"]'), 'Your details are valid. Account creation requires a server connection.');
            registrationForm.reset();
        });
    }

    document.querySelectorAll('.gs4').forEach((newsletter) => {
        const input = newsletter.querySelector('input');
        const arrow = newsletter.querySelector('.fa-right-long');
        if (!input || !arrow) return;
        input.type = 'email';
        input.setAttribute('aria-label', 'Email address for newsletter');
        input.required = true;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'site-subscribe';
        button.setAttribute('aria-label', 'Subscribe to newsletter');
        button.append(arrow.cloneNode(true));
        arrow.replaceWith(button);
        button.addEventListener('click', () => {
            if (!input.reportValidity()) return;
            statusMessage(button, 'Thanks. Newsletter subscriptions require a server connection.');
            input.value = '';
        });
    });
})();
