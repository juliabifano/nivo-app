import { useSettingsStore } from "../store/useSettingsStore";
import { useTheme } from "../theme/useTheme";

export default function Settings() {
  const { settings, updateSetting, updateNestedSetting, resetSettings } =
    useSettingsStore();

  const { theme, themeName } = useTheme();

  return (
    <div
      className={`
      h-full overflow-hidden
      px-4 pt-5 pb-28 lg:p-6
      flex justify-center
      ${theme.textPrimary}
    `}
    >
      <div className="w-full max-w-[540px] h-full min-h-0 flex flex-col gap-6 overflow-hidden">
        <div className="shrink-0">
          <p
            className={`text-sm ${theme.accentText} tracking-[0.18em] uppercase`}
          >
            App
          </p>

          <h1 className="text-3xl font-semibold mt-2">Configurações</h1>

          <p className={`text-sm mt-2 ${theme.textSecondary}`}>
            Personalize a experiência do Nivo.
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar pb-40 lg:pb-8 space-y-8">
          <SettingsSection title="Aparência" theme={theme}>
            <div className="p-5">
              <p className="text-sm font-medium">Tema</p>

              <p className={`text-xs mt-1 mb-4 ${theme.textSecondary}`}>
                Escolha entre tema claro ou escuro.
              </p>

              <div className="flex gap-3">
                <ThemeButton
                  active={settings.theme === "dark"}
                  onClick={() => updateSetting("theme", "dark")}
                  themeName={themeName}
                >
                  Escuro
                </ThemeButton>

                <ThemeButton
                  active={settings.theme === "light"}
                  onClick={() => updateSetting("theme", "light")}
                  themeName={themeName}
                >
                  Claro
                </ThemeButton>
              </div>
            </div>

            <Divider themeName={themeName} />

            <div className="p-5">
              <p className="text-sm font-medium">Moeda</p>

              <p className={`text-xs mt-1 mb-4 ${theme.textSecondary}`}>
                Defina a moeda principal do app.
              </p>

              <select
                value={settings.currency}
                onChange={(e) => updateSetting("currency", e.target.value)}
                className={`
                w-full h-12 rounded-2xl px-4 text-sm outline-none
                ${theme.surface}
                border ${theme.border}
                ${theme.textPrimary}
              `}
              >
                <option value="BRL">Real brasileiro (BRL)</option>
                <option value="USD">Dólar americano (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
          </SettingsSection>

          <SettingsSection title="Notificações" theme={theme}>
            <SwitchItem
              title="Vencimentos"
              description="Receba alertas de contas e cartões."
              checked={settings.notifications.dueDates}
              onChange={() =>
                updateNestedSetting(
                  "notifications",
                  "dueDates",
                  !settings.notifications.dueDates,
                )
              }
              theme={theme}
              themeName={themeName}
            />

            <Divider themeName={themeName} />

            <SwitchItem
              title="Lembretes"
              description="Lembretes gerais do app."
              checked={settings.notifications.reminders}
              onChange={() =>
                updateNestedSetting(
                  "notifications",
                  "reminders",
                  !settings.notifications.reminders,
                )
              }
              theme={theme}
              themeName={themeName}
            />
          </SettingsSection>

          <SettingsSection title="Dados" theme={theme}>
            <button
              onClick={resetSettings}
              className={`
              w-full text-left p-5 transition-all cursor-pointer
              ${theme.surfaceHover}
            `}
            >
              <p className={`text-sm font-medium ${theme.dangerText}`}>
                Restaurar configurações
              </p>

              <p className={`text-xs mt-1 ${theme.textSecondary}`}>
                Volta todas as preferências para o padrão.
              </p>
            </button>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, theme, children }) {
  return (
    <section>
      <h2
        className={`text-xs uppercase tracking-[0.18em] ${theme.textMuted} mb-3`}
      >
        {title}
      </h2>

      <div
        className={`${theme.surface} border ${theme.border} rounded-[28px] overflow-hidden`}
      >
        {children}
      </div>
    </section>
  );
}

function Divider({ themeName }) {
  return (
    <div
      className={`h-px ${
        themeName === "light" ? "bg-slate-200/50" : "bg-white/[0.06]"
      }`}
    />
  );
}

function ThemeButton({ active, onClick, children, themeName }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 h-11 rounded-2xl border text-sm font-medium transition-all ${
        active
          ? "bg-emerald-400 text-black border-emerald-400"
          : themeName === "light"
            ? "bg-white/70 border-slate-200/70 text-slate-600 hover:bg-white"
            : "bg-white/[0.03] border-white/[0.08] text-gray-300 hover:bg-white/[0.06]"
      }`}
    >
      {children}
    </button>
  );
}

function SwitchItem({
  title,
  description,
  checked,
  onChange,
  theme,
  themeName,
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className={`text-xs mt-1 ${theme.textSecondary}`}>{description}</p>
      </div>

      <button
        onClick={onChange}
        className={`w-14 h-8 rounded-full transition-all relative ${
          checked
            ? "bg-emerald-400"
            : themeName === "light"
              ? "bg-slate-200"
              : "bg-white/[0.08]"
        }`}
      >
        <div
          className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
