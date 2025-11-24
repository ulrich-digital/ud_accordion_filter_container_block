/**
 * ===============================================================
 * Filter-Integration für Akkordeon-Block
 * ===============================================================
 *
 * Dieses Skript kümmert sich ausschließlich um das Setzen und Entfernen
 * der CSS-Klasse `.is-open` auf Akkordeon-Blöcken. Damit wird gesteuert,
 * ob ein Akkordeon geöffnet oder geschlossen ist.
 *
 * Die tatsächliche Animation, Höhenanpassung und Layout-Reaktion erfolgt
 * nicht hier, sondern im eigentlichen Accordion-Block (Plugin),
 * der auf Klassenzustände wie `.is-open` oder `.is-filtered-out` reagiert.
 *
 * Bei aktiven Filtern werden nur passende Accordion-Elemente geöffnet,
 * alle anderen werden geschlossen und optisch ausgeblendet.
 *
 * Architektur:
 * 👉 Zustandssteuerung über CSS-Klassen
 * 👉 Keine direkte Manipulation von Höhen oder Inhalten
 * 👉 Integration über das zentrale Event "global-filter-change"
 */

(function ($) {
	// Akkordeon öffnen (mit Animation und Sichtbarkeit der Links)
	function openAccordion($accordion) {
		const content = $accordion.find("> .ud-accordion__content")[0];
		const icon = $accordion.find(
			"> .ud-accordion__title > .ud-accordion__icon"
		)[0];
		if (!content) return;

		$accordion.addClass("is-open").removeClass("is-filtered-out");
		icon?.classList.add("is-open");
	}

	// Akkordeon schließen (mit Animation)
	function closeAccordion($accordion) {
		const content = $accordion.find("> .ud-accordion__content")[0];
		const icon = $accordion.find(
			"> .ud-accordion__title > .ud-accordion__icon"
		)[0];
		if (!content) return;

		$accordion.removeClass("is-open");
		icon?.classList.remove("is-open");
	}

	function collectActiveFilters() {
		const filters = [];
		$(".filter-button-group").each(function () {
			const val = $(this).attr("data-current-filter");
			if (val && val !== "*") {
				filters.push(val);
			}
		});
		return filters;
	}

	// Filterfunktion für Akkordeons (keine Filterung der Links!)
	function initAccordionFiltering() {
		const $group = $(".wp-block-ud-filter-tag-block");

		$(document).on("global-filter-change", function () {
			const activeFilters = collectActiveFilters();
			const isAll = activeFilters.length === 0;

			$(".accordion-block-container > .wp-block-ud-accordion-block").each(
				function () {
					const $accordion = $(this);

					if (isAll) {
						closeAccordion($accordion);
						$accordion.removeClass("is-filtered-out");
						return;
					}

					const tags = JSON.parse(
						$accordion.attr("data-tags-slug") || "[]"
					);
					const match = activeFilters.every((f) => tags.includes(f));

					if (match) {
						openAccordion($accordion);
					} else {
						closeAccordion($accordion);
						$accordion.addClass("is-filtered-out");
					}
				}
			);
		});
	}

	// Initialisierung beim DOM-Ready
	$(function () {
		initAccordionFiltering();

		$(function () {
			const hasFilterButtons = $(".filter-button-group").length > 0;

			if (!hasFilterButtons) {
				$(".accordion-block-container").addClass(
					"ud-accordion-filter-active"
				);
			}
		});

		// ===========================================================
		// UD ACCORDION CLICK FILTER (EVENT PRODUCER)
		// ===========================================================
		$(document).on(
			"click",
			".accordion-block-container > .wp-block-ud-accordion-block",
			function (e) {
				// Prevent reacting to nested accordions
				if (
					!$(e.target)
						.closest(".wp-block-ud-accordion-block")
						.is(this)
				) {
					return;
				}

				const $clicked = $(this);
				const $accordions = $(
					".accordion-block-container > .wp-block-ud-accordion-block"
				);
				const isAlreadyActive = $clicked.hasClass("ud-filter-active");
				const hasFilterButtons = $(".filter-button-group").length > 0;

				// Tags aus Accordion lesen
				let clickedTags = [];
				try {
					clickedTags = JSON.parse(
						$clicked.attr("data-tags-slug") || "[]"
					);
				} catch {}

				// -----------------------------------------------------------
				// RESET bei erneutem Klick
				// -----------------------------------------------------------
				if (isAlreadyActive) {
					// Accordions zurücksetzen
					$accordions.removeClass(
						"ud-filter-active is-filtered-out is-open"
					);
					$accordions.each(function () {
						$(this)
							.find("> .ud-accordion__title")
							.attr("aria-expanded", "false");
						$(this)
							.find("> .ud-accordion__content")
							.css("max-height", "0");
						$(this)
							.find(
								"> .ud-accordion__title > .ud-accordion__icon"
							)
							.removeClass("is-open");
					});

					if (hasFilterButtons) {
						// 🔥 altes System nutzen
						$(".filter-button-group").attr(
							"data-current-filter",
							"*"
						);
						$(document).trigger("global-filter-change");
					} else {
						// 🔥 neues System nutzen
						$(".wp-block-ud-link-block").show();
						$(".link-block-container").isotope?.("layout");
					}

					return;
				}

				// -----------------------------------------------------------
				// NORMAL KLICK → Accordion filtern
				// -----------------------------------------------------------

				$accordions.removeClass(
					"ud-filter-active is-filtered-out is-open"
				);

				$clicked.addClass("ud-filter-active is-open");
				$clicked
					.find("> .ud-accordion__title")
					.attr("aria-expanded", "true");
				$clicked
					.find("> .ud-accordion__content")
					.css("max-height", "none");
				$clicked
					.find("> .ud-accordion__title > .ud-accordion__icon")
					.addClass("is-open");

				// nachfolgende Accordions ausblenden
				let reachedClicked = false;

				$accordions.each(function () {
					const $acc = $(this);

					if ($acc.is($clicked)) {
						reachedClicked = true;
						return;
					}

					if (reachedClicked) {
						$acc.addClass("is-filtered-out");
					} else {
						$acc.removeClass("is-filtered-out");
					}
				});

				// -----------------------------------------------------------
				// LINKS FILTERN (2 mögliche Systeme)
				// -----------------------------------------------------------

				if (hasFilterButtons) {
					// 🔥 altes System
					$(".filter-button-group").attr(
						"data-current-filter",
						clickedTags[0] || "*"
					);
					$(document).trigger("global-filter-change");
				} else {
					// 🔥 neues System – direkte Link-Filterung
					$(".wp-block-ud-link-block").each(function () {
						let linkTags = [];

						try {
							linkTags = JSON.parse(
								$(this).attr("data-tags-slug") || "[]"
							);
						} catch {}

						const match = linkTags.some((tag) =>
							clickedTags.includes(tag)
						);
						$(this).toggle(match);
					});

					$(".link-block-container").isotope?.("layout");
				}
			}
		);
	});
})(jQuery);
