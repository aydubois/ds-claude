import {
  Component,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { AyTabComponent } from './tab.component'

@Component({
  selector: 'ay-tabs',
  standalone: true,
  imports: [CommonModule],
  host: {
    'class': 'ay-tabs',
  },
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class AyTabsComponent implements AfterContentInit {
  @Output() tabChange = new EventEmitter<number>()

  @ContentChildren(AyTabComponent) tabs!: QueryList<AyTabComponent>
  activeIndex = 0

  ngAfterContentInit(): void {
    this.activateTab(this.activeIndex)
    this.tabs.changes.subscribe(() => {
      if (this.tabs.length > 0) {
        this.activateTab(this.activeIndex)
      }
    })
  }

  selectTab(index: number): void {
    const tabList = this.tabs.toArray()
    if (index < 0 || index >= tabList.length) return
    if (tabList[index].disabled) return

    this.activeIndex = index
    this.activateTab(index)
    this.tabChange.emit(index)
  }

  onKeydown(event: KeyboardEvent, currentIndex: number): void {
    const tabList = this.tabs.toArray()
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
    const tabList = this.tabs.toArray()
    tabList.forEach((tab, i) => tab.active = i === index)
  }

  private findNextEnabledTab(from: number, direction: 1 | -1): number {
    const tabList = this.tabs.toArray()
    let index = from + direction

    while (index >= 0 && index < tabList.length) {
      if (!tabList[index].disabled) return index
      index += direction
    }

    return from
  }
}
