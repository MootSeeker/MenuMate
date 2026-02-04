/**
 * DateNavigation Component
 *
 * Navigation zwischen Tagen im Tagebuch mit Kalender-Popup
 * Implementiert Issue #26: Date Navigation
 */

import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { cssInterop } from 'nativewind';

import { Text } from '@/components/ui';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useJournalStore, formatDateForDisplay, isToday, stringToDate } from '../stores';

// Enable NativeWind styling
cssInterop(View, { className: 'style' });
cssInterop(Pressable, { className: 'style' });

export interface DateNavigationProps {
  /** Zusätzliche NativeWind-Klassen */
  className?: string;
}

/**
 * Pfeil-Icon nach links
 */
function ChevronLeft() {
  return (
    <Text variant="heading-3" color="primary" className="px-2">
      ‹
    </Text>
  );
}

/**
 * Pfeil-Icon nach rechts
 */
function ChevronRight({ disabled }: { disabled: boolean }) {
  return (
    <Text variant="heading-3" color={disabled ? 'tertiary' : 'primary'} className="px-2">
      ›
    </Text>
  );
}

/**
 * Einfacher Kalender für Datumsauswahl
 */
function SimpleCalendar({
  selectedDate,
  onSelectDate,
  onClose,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}) {
  const [viewDate, setViewDate] = useState(selectedDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Monat und Jahr des aktuellen Views
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Erster Tag des Monats
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Anzahl Tage im Monat
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Wochentage (Deutsch, Montag zuerst)
  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  // Anpassung für Montag als ersten Tag (0 = Montag, 6 = Sonntag)
  const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  // Kalender-Grid erstellen
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < adjustedStartDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Monat navigieren
  const goToPreviousMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(year, month + 1, 1);
    if (nextMonth <= today) {
      setViewDate(nextMonth);
    }
  };

  // Prüfen ob nächster Monat erreichbar ist
  const canGoToNextMonth = new Date(year, month + 1, 1) <= today;

  // Tag auswählen
  const handleDayPress = (day: number) => {
    const selected = new Date(year, month, day);
    if (selected <= today) {
      onSelectDate(selected);
      onClose();
    }
  };

  // Prüfen ob ein Tag der ausgewählte ist
  const isSelectedDay = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  // Prüfen ob ein Tag heute ist
  const isTodayDay = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  // Prüfen ob ein Tag in der Zukunft liegt
  const isFutureDay = (day: number) => {
    const date = new Date(year, month, day);
    return date > today;
  };

  // Monatsname deutsch
  const monthNames = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];

  return (
    <View className="p-4">
      {/* Header mit Monat/Jahr und Navigation */}
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable
          onPress={goToPreviousMonth}
          className="p-2"
          accessibilityLabel="Vorheriger Monat"
        >
          <Text variant="heading-4" color="primary">
            ‹
          </Text>
        </Pressable>

        <Text variant="heading-4">
          {monthNames[month]} {year}
        </Text>

        <Pressable
          onPress={goToNextMonth}
          disabled={!canGoToNextMonth}
          className="p-2"
          accessibilityLabel="Nächster Monat"
        >
          <Text variant="heading-4" color={canGoToNextMonth ? 'primary' : 'tertiary'}>
            ›
          </Text>
        </Pressable>
      </View>

      {/* Wochentage */}
      <View className="mb-2 flex-row">
        {weekDays.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text variant="caption" color="secondary">
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Kalender-Grid */}
      <View className="flex-row flex-wrap">
        {calendarDays.map((day, index) => (
          <View key={index} className="aspect-square w-[14.28%] p-0.5">
            {day !== null && (
              <Pressable
                onPress={() => handleDayPress(day)}
                disabled={isFutureDay(day)}
                className={`flex-1 items-center justify-center rounded-full ${isSelectedDay(day) ? 'bg-primary-500' : ''} ${isTodayDay(day) && !isSelectedDay(day) ? 'border border-primary-500' : ''} ${isFutureDay(day) ? 'opacity-30' : ''} `}
                accessibilityLabel={`${day}. ${monthNames[month]}`}
              >
                <Text variant="body-sm" color={isSelectedDay(day) ? 'inverse' : 'default'}>
                  {day}
                </Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>

      {/* Heute-Button */}
      <View className="mt-4">
        <Button
          variant="outline"
          size="sm"
          onPress={() => {
            onSelectDate(today);
            onClose();
          }}
        >
          Heute
        </Button>
      </View>
    </View>
  );
}

/**
 * DateNavigation Komponente
 *
 * Zeigt das ausgewählte Datum mit Pfeilen zur Navigation und
 * ermöglicht die Auswahl über einen Kalender.
 */
export function DateNavigation({ className = '' }: DateNavigationProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  const selectedDate = useJournalStore((state) => state.selectedDate);
  const goToPreviousDay = useJournalStore((state) => state.goToPreviousDay);
  const goToNextDay = useJournalStore((state) => state.goToNextDay);
  const setSelectedDate = useJournalStore((state) => state.setSelectedDate);
  const canGoToNextDay = useJournalStore((state) => state.canGoToNextDay);

  const dateObj = stringToDate(selectedDate);
  const displayText = formatDateForDisplay(dateObj);
  const isTodaySelected = isToday(dateObj);
  const nextDisabled = !canGoToNextDay();

  return (
    <>
      <View
        className={`flex-row items-center justify-center py-2 ${className}`}
        accessibilityRole="toolbar"
        accessibilityLabel="Datumsnavigation"
      >
        {/* Zurück-Button */}
        <Pressable
          onPress={goToPreviousDay}
          className="p-2 active:opacity-70"
          accessibilityLabel="Vorheriger Tag"
          accessibilityHint="Zeigt die Einträge vom vorherigen Tag"
        >
          <ChevronLeft />
        </Pressable>

        {/* Datum (öffnet Kalender) */}
        <Pressable
          onPress={() => setShowCalendar(true)}
          className="px-4 py-2 active:opacity-70"
          accessibilityLabel={`Ausgewähltes Datum: ${displayText}. Tippen zum Öffnen des Kalenders.`}
        >
          <View className="flex-row items-center">
            <Text variant="heading-4" color={isTodaySelected ? 'primary' : 'default'}>
              {displayText}
            </Text>
            {isTodaySelected && <View className="ml-2 h-2 w-2 rounded-full bg-primary-500" />}
          </View>
        </Pressable>

        {/* Vor-Button */}
        <Pressable
          onPress={goToNextDay}
          disabled={nextDisabled}
          className={`p-2 ${nextDisabled ? 'opacity-30' : 'active:opacity-70'}`}
          accessibilityLabel="Nächster Tag"
          accessibilityHint={
            nextDisabled
              ? 'Nicht verfügbar - keine Navigation in die Zukunft'
              : 'Zeigt die Einträge vom nächsten Tag'
          }
        >
          <ChevronRight disabled={nextDisabled} />
        </Pressable>
      </View>

      {/* Kalender Modal */}
      <Modal visible={showCalendar} onClose={() => setShowCalendar(false)} title="Datum wählen">
        <SimpleCalendar
          selectedDate={dateObj}
          onSelectDate={(date) => setSelectedDate(date)}
          onClose={() => setShowCalendar(false)}
        />
      </Modal>
    </>
  );
}

export default DateNavigation;
