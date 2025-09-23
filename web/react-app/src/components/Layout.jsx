import Header from './Header'

const Layout = ({ children }) => {
  return (
    <div className="br-layout">
      <Header />
      <main id="outlet">
        {children}
      </main>
    </div>
  )
}

export default Layout