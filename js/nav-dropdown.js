document.addEventListener('DOMContentLoaded', function () {
    const menus = Array.from(document.querySelectorAll('.more-menu-dropdown'));

    if (!menus.length) {
        return;
    }

    const syncExpandedState = menu => {
        const toggle = menu.querySelector('.more-toggle');
        if (!toggle) {
            return;
        }
        toggle.setAttribute('aria-expanded', menu.open ? 'true' : 'false');
    };

    menus.forEach(menu => {
        syncExpandedState(menu);
        menu.addEventListener('toggle', function () {
            if (menu.open) {
                menus.forEach(otherMenu => {
                    if (otherMenu !== menu) {
                        otherMenu.open = false;
                        syncExpandedState(otherMenu);
                    }
                });
            }
            syncExpandedState(menu);
        });
    });

    document.addEventListener('click', function (event) {
        menus.forEach(menu => {
            if (menu.open && !menu.contains(event.target)) {
                menu.open = false;
                syncExpandedState(menu);
            }
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') {
            return;
        }

        menus.forEach(menu => {
            if (!menu.open) {
                return;
            }

            menu.open = false;
            syncExpandedState(menu);

            const toggle = menu.querySelector('.more-toggle');
            if (toggle) {
                toggle.focus();
            }
        });
    });
});
