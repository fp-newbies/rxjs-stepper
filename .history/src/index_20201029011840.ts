import { BehaviorSubject, from, fromEvent } from 'rxjs'
import { map, tap, filter, find, findIndex switchMap } from 'rxjs/operators'

type DOMEvent<T = Element> = Event & {
  currentTarget: T
  target: Element
}

const allSteps = document.querySelectorAll<HTMLFormElement>('#stepper form.step')

const allSteps$ = from(allSteps)

const activeIndexStep$ = new BehaviorSubject(0)

const submitForm$ = fromEvent<DOMEvent<HTMLFormElement>>(allSteps, 'submit')
  .pipe(
    tap(e => e.preventDefault())
  )

const nextIndexStep$ = submitForm$
  .pipe(
    switchMap(event => allSteps$.pipe(
      findIndex(step => event.currentTarget === step)
    ))
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
  console.log('hiddenSteps', element)
  element.hidden = true
})

visibleSteps$.subscribe((element) => {
  console.log('visibleSteps', element)
  element.hidden = false
})

nextIndexStep$.subscribe(activeIndexStep$)
