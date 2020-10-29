import { BehaviorSubject, from, fromEvent } from 'rxjs'
import { map, tap, filter, find, switchMap } from 'rxjs/operators'

type DOMEvent<T = Element> = Event & {
  currentTarget: T
  target: Element
}

const allSteps = document.querySelectorAll<HTMLFormElement>('#stepper form.step')

const allSteps$ = from(allSteps)
  .pipe(
    map((element, index) => ({
      element, 
      index, 
      name: element.getAttribute('name')
    }))
  )

const activeIndexStep$ = new BehaviorSubject(0)

const submitForm$ = fromEvent<DOMEvent<HTMLFormElement>>(allSteps, 'submit')
  .pipe(
    tap(e => e.preventDefault())
  )

const nextStep$ = submitForm$
  .pipe(
    map(e => {
      const currentStep = Number(e.currentTarget.getAttribute('data-step'))
      const activeIndexStep = currentStep < allSteps.length - 1 ? currentStep + 1 : currentStep
      debugger
      return activeIndexStep
    }),
  )

const hiddenSteps$ = activeIndexStep$.pipe(
  switchMap(activeIndexStep =>
    allSteps$.pipe(
      filter(({ index }) => index !== activeIndexStep),
    )
  ),
)

const visibleSteps$ = activeIndexStep$.pipe(
  switchMap(activeIndexStep =>
    allSteps$.pipe(
      find(({ index }) => index === activeIndexStep),
    )
  ),
)

hiddenSteps$.subscribe(({ element }) => {
  console.log('hiddenSteps', element)
  element.hidden = true
})

visibleSteps$.subscribe(({ element }) => {
  console.log('visibleSteps', element)
  element.hidden = false
})

nextStep$.subscribe(activeIndexStep$)