import {
  Component,
  output,
  signal,
  contentChildren,
  afterNextRender,
  effect,
} from '@angular/core'
import { AyTabComponent } from './tab.component'

@Component({
  selector: 'ay-tabs',
  standalone: true,
  host: {
    'class': 'ay-tabs',
  },
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class AyTabsComponent {
  readonly tabChange = output<number>()

  readonly tabs = contentChildren(AyTabComponent)
  readonly activeIndex = signal(0)

  constructor() {
    afterNextRender(() => {
      this.activateTab(this.activeIndex())
    })

    effect(() => {
      const tabList = this.tabs()
      if (tabList.length > 0) {
        this.activateTab(this.activeIndex())
      }
    })
  }

  selectTab(index: number): void {
    const tabList = this.tabs()
    if (index < 0 || index >= tabList.length) return
    if (tabList[index].disabled()) return

    this.activeIndex.set(index)
    this.activateTab(index)
    this.tabChange.emit(index)
  }

  onKeydown(event: KeyboardEvent, currentIndex: number): void {
    const tabList = this.tabs()
    let newIndex = currentIndex

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      newIndex = this.findNextEnabledTab(currentIndex, 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      newIndex = this.findNextEnabledTab(currentIndex, -1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      newIndex = this.findNextEnabledTab(-1, 1)
    } else if (event.key === 'End') {
      event.preventDefault()
      newIndex = this.findNextEnabledTab(tabList.length, -1)
    } else {
      return
    }

    if (newIndex !== currentIndex) {
      this.selectTab(newIndex)
      const button = (event.target as HTMLElement)
        .closest('[role="tablist"]')
        ?.querySelectorAll('[role="tab"]')
        ?.[newIndex] as HTMLElement | undefined
      button?.focus()
    }
  }

  private activateTab(index: number): void {
    const tabList = this.tabs()
    tabList.forEach((tab, i) => tab.active.set(i === index))
  }

  private findNextEnabledTab(from: number, direction: 1 | -1): number {
    const tabList = this.tabs()
    let index = from + direction

    while (index >= 0 && index < tabList.length) {
      if (!tabList[index].disabled()) return index
      index += direction
    }

    return from
  }
}
