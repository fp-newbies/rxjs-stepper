import { BehaviorSubject, from, fromEvent } from 'rxjs'
import { map, tap, filter, find, findIndex, switchMap } from 'rxjs/operators'

type DOMEvent<T = Element> = Event & {
  currentTarget: T
  target: Element
}

const allSteps = document.querySelectorAll<HTMLFormElement>('.stepper-item')
const allForms = document.querySelectorAll<HTMLFormElement>('.stepper-item form')
const prevButton = document.querySelectorAll<HTMLFormElement>('.stepper-prev')

const allSteps$ = from(allSteps)

const activeIndexStep$ = new BehaviorSubject(0)

const nextIndexStep$ = fromEvent<DOMEvent<HTMLFormElement>>(allForms, 'submit')
  .pipe(
    tap(e => e.preventDefault()),
    map(() => {
      const stepIndex = activeIndexStep$.getValue()
      return stepIndex < allSteps.length - 1 ? stepIndex + 1 : stepIndex
    })
  )

const prevIndexStep$ = fromEvent<DOMEvent<HTMLFormElement>>(prevButton, 'click')
    .pipe(
      tap(e => e.preventDefault()),
      map(() => {
        const stepIndex = activeIndexStep$.getValue()
        return stepIndex >= 0 ? stepIndex - 1 : stepIndex
      })
    )

const hiddenSteps$ = activeIndexStep$.pipe(
  switchMap(activeIndexStep =>
    allSteps$.pipe(
      filter((element, index) => index !== activeIndexStep),
    )
  ),
)

const visibleSteps$ = activeIndexStep$.pipe(
  switchMap(activeIndexStep =>
    allSteps$.pipe(
      find((element, index) => index === activeIndexStep),
    )
  ),
)

hiddenSteps$.subscribe((element) => {
  console.log('hiddenSteps', element.firstElementChild.textContent)
  element.classList.remove('active')
})

visibleSteps$.subscribe((element) => {
  console.log('visibleSteps', element.firstElementChild.textContent)
  element.classList.add('active')
})

nextIndexStep$.subscribe(activeIndexStep$)

prevIndexStep$.subscribe(activeIndexStep$)

activeIndexStep$.subscribe((activeIndexStep) => {
  console.log('activeIndexStep', activeIndexStep)
})
