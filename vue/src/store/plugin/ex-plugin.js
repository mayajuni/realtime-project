const exPluin = store => {
  // 저장소가 초기화 될 때 불립니다.
  store.subscribe((mutation, state) => {
    // 매 변이시마다 불립니다.
    // 변이는 { type, payload } 포맷으로 제공됩니다.
  })
}

export default exPluin
