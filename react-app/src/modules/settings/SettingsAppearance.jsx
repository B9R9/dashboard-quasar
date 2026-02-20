import useAppearanceStore from '../../stores/appearance.store'
import OptionSelect from '../../components/shared/OptionSelect'

export default function SettingsAppearance() {
  const { theme, themeOptions, setTheme, font, fontOptions, setFont } = useAppearanceStore()

  return (
    <div className="settings-appearance">
      <h3 className="settings-appearance__title">Appearance</h3>
      <small className="settings-appearance__description">
        Customize the look and feel of your dashboard. You can change themes, font, and other visual
        settings.
      </small>
      <div className="settings-appearance__option p-4">
        <label htmlFor="theme-select" className="settings-appearance__option-label">
          Theme
        </label>
        <OptionSelect id="theme-select" value={theme} options={themeOptions} onChange={setTheme} />
      </div>

      <div className="settings-appearance__option p-4">
        <label htmlFor="font-select" className="settings-appearance__option-label">
          Font
        </label>
        <OptionSelect id="font-select" value={font} options={fontOptions} onChange={setFont} />
      </div>
    </div>
  )
}
