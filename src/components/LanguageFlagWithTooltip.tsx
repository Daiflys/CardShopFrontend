import React from 'react';
import Tooltip from './Tooltip';
import { getLanguageFlag, getLanguageName, LanguageSize } from '../utils/languageFlags';

export interface LanguageFlagWithTooltipProps {
  languageCode: string;
  size?: LanguageSize;
  tooltipClassName?: string;
}

/**
 * Language flag component with automatic tooltip showing full language name
 * Example: "en" flag shows "English" on hover
 *
 * This is the standard way to display language flags across the app.
 */
const LanguageFlagWithTooltip: React.FC<LanguageFlagWithTooltipProps> = ({
  languageCode,
  size = 'normal',
  tooltipClassName
}) => {
  const languageName = getLanguageName(languageCode);
  const flag = getLanguageFlag(languageCode, size);

  return (
    <Tooltip content={languageName} className={tooltipClassName}>
      <div className="inline-flex items-center justify-center">
        {flag}
      </div>
    </Tooltip>
  );
};

export default LanguageFlagWithTooltip;
