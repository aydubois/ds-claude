/*
 * Public API Surface of ds-ponyo
 */

// Button
export { AyButtonComponent } from './lib/button/button.component';
export type { AyButtonVariant, AyButtonColor, AyButtonSize } from './lib/button/button.model';

// Input
export { AyInputComponent } from './lib/input/input.component';
export type { AyInputType } from './lib/input/input.model';

// Checkbox
export { AyCheckboxComponent } from './lib/checkbox/checkbox.component';

// Radio
export { AyRadioComponent } from './lib/radio/radio.component';

// Select
export { AySelectComponent } from './lib/select/select.component';
export type { AySelectOption } from './lib/select/select.model';

// Multi-select
export { AyMultiSelectComponent } from './lib/multi-select/multi-select.component';
export type { AyMultiSelectOption } from './lib/multi-select/multi-select.model';

// Table
export { AyTableComponent, AyCellDefDirective } from './lib/table/table.component';
export type { AyColumnDef, AySortDirection, AySortEvent } from './lib/table/table.model';

// Dialog
export { AyDialogComponent } from './lib/dialog/dialog.component';

// Toast
export { AyToastContainerComponent } from './lib/toast/toast.component';
export { AyToastService } from './lib/toast/toast.service';
export type { AyToast, AyToastType } from './lib/toast/toast.model';

// Pagination
export { AyPaginationComponent } from './lib/pagination/pagination.component';
export type { AyPageEvent } from './lib/pagination/pagination.model';

// Accordion
export { AyAccordionComponent } from './lib/accordion/accordion.component';
export { AyAccordionPanelComponent } from './lib/accordion/accordion-panel.component';

// Icon
export { AyIconComponent } from './lib/icon/icon.component';
export { AY_ICONS } from './lib/icon/icons';

// Spinner
export { AySpinnerComponent } from './lib/spinner/spinner.component';

// Skeleton
export { AySkeletonComponent } from './lib/skeleton/skeleton.component';

// Switch
export { AySwitchComponent } from './lib/switch/switch.component';

// Slider
export { AySliderComponent } from './lib/slider/slider.component';
export type { AySliderConfig } from './lib/slider/slider.model';

// Snackbar
export { AySnackbarContainerComponent } from './lib/snackbar/snackbar.component';
export { AySnackbarService } from './lib/snackbar/snackbar.service';
export type { AySnackbar, AySnackbarConfig } from './lib/snackbar/snackbar.model';

// Tabs
export { AyTabsComponent } from './lib/tabs/tabs.component';
export { AyTabComponent } from './lib/tabs/tab.component';

// Segmented Menu
export { AySegmentedMenuComponent } from './lib/segmented-menu/segmented-menu.component';
export type { AySegmentOption } from './lib/segmented-menu/segmented-menu.model';

// Date Picker
export { AyDatePickerComponent } from './lib/date-picker/date-picker.component';

// Navigation Rail
export { AyNavigationRailComponent } from './lib/navigation-rail/navigation-rail.component';
export type { AyNavRailItem } from './lib/navigation-rail/navigation-rail.model';
