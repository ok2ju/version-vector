const VVwE = require('./vvwe')
const Version = require('./version')

describe('Version Vectors with Exceptions', () => {
  describe('VVwE entity', () => {
    it('set local version initial values', () => {
      const p1 = new VVwE(11)
      expect(p1.local.siteId).toEqual(11)
      expect(p1.local.counter).toEqual(0)
      expect(p1.local.exceptions).toEqual([])
    })
  })

  describe('increment', () => {
    let p1 = null

    beforeEach(() => {
      p1 = new VVwE(11)
    })

    it('increment local version', () => {
      p1.increment()
      expect(p1.local.counter).toEqual(1)
    })

    it('increments without exception', () => {
      p1.increment()
      p1.increment()
      expect(p1.local.exceptions).toHaveLength(0)
    })
  })

  describe('update [remote operation]', () => {
    let p1 = null
    let p2 = null

    beforeEach(() => {
      p1 = new VVwE(11)
      p2 = new VVwE(22)
    })

    it('increments version from another remote version vectors', () => {
      p2.increment()
      p1.update(p2.local)
      expect(p2.vector[0].counter).toEqual(1)
      expect(p1.vector[1].counter).toEqual(p2.local.counter)
    })

    it('checks if increment from anywhere does not affect my local version', () => {
      p2.increment()
      p1.update(p2.local)
      expect(p1.local.counter).toEqual(0)
    })

    it('a message is lost, exception is made', () => {
      p2.increment()
      p2.increment()
      expect(p2.local.counter).toEqual(2)

      p1.update(p2.local)
      expect(p1.vector[1].exceptions).toHaveLength(1)
      expect(p1.vector[1].exceptions.indexOf(1)).toBeGreaterThan(-1)
    })
  })

  describe('isApplied <-> has been applied', () => {
    it('checks if an operation depending on another isApplied', () => {
      const p1 = new VVwE(11)
      p1.increment()
      expect(p1.isApplied(p1.local)).toBeTruthy()

      const newVersion = new Version(11)
      newVersion.counter = p1.local.counter + 1
      expect(p1.isApplied(newVersion)).toBeFalsy()
    })

    it('checks if an operation independent of any other isApplied', () => {
      const p1 = new VVwE(11)
      const c = null
      expect(p1.isApplied(c)).toBeTruthy()
    })

    it('checks in the omen vector for target operation', () => {
      const p1 = new VVwE(11)
      const p2 = new VVwE(22)

      p2.increment()
      p2.increment()

      p1.update(p2.local)

      expect(p1.isApplied(p2.local)).toBeTruthy()
    })
  })
})
