import SettingsAppearance from '../modules/settings/SettingsAppearance'
import SettingsQuickLinks from '../modules/settings/SettingsQuickLinks'

export default function Settings() {
  return (
    <div className="settings-page flex flex-col items-center p-4 gap-4 w-full">
      <div className="settings-page__card w-full p-4">
        <div className="settings-page__header flex items-center justify-between">
          <div className="flex flex-row gap-4">
            <button className="settings-page__back-button" onClick={() => window.history.back()}>
              <span className="material-symbols-outlined" aria-hidden>
                arrow_back
              </span>
            </button>
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          <button className="settings-page__close-button" onClick={() => window.history.back()}>
            <span className="material-symbols-outlined" aria-hidden>
              close
            </span>
          </button>
        </div>
        <hr className="separator" />
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <div className="settings-page__content flex flex-col gap-4 border rounded-md p-4">
            <SettingsQuickLinks />
          </div>
          <div className="settings-page__content flex flex-col gap-4 border rounded-md p-4">
            <SettingsAppearance />
          </div>
        </div>
      </div>
    </div>
  )
}
