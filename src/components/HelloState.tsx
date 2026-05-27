import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const HelloState: React.FC = () => {
  // Input states
  const [numA, setNumA] = useState('1.6');
  const [numB, setNumB] = useState('4.5');
  
  // Track which input is currently active/focused ('A' or 'B')
  const [activeInput, setActiveInput] = useState<'A' | 'B'>('A');
  
  // Calculation result states
  const [selectedOp, setSelectedOp] = useState<'+' | '-' | '*' | '/' | 'COMPARE'>('-');
  const [result, setResult] = useState<string>('Hiệu: -2.9000000000000004');
  const [rawNumberResult, setRawNumberResult] = useState<number | null>(-2.9);
  const [currentOpLabel, setCurrentOpLabel] = useState<string>('Hiệu');
  const [roundOption, setRoundOption] = useState<'raw' | '2' | 'integer'>('raw');
  
  // Calendar / Date state (defaults to 0, can be selected)
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);

  // Generate days for custom calendar modal (1 to 31)
  const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);

  // Dynamic result rendering with rounding options
  const renderResultText = () => {
    if (rawNumberResult !== null && currentOpLabel !== '') {
      if (roundOption === '2') {
        return `${currentOpLabel}: ${rawNumberResult.toFixed(2)}`;
      } else if (roundOption === 'integer') {
        return `${currentOpLabel}: ${Math.round(rawNumberResult)}`;
      } else {
        return `${currentOpLabel}: ${rawNumberResult}`;
      }
    }
    return result;
  };

  // Math operation handler
  const handleOperation = (op: '+' | '-' | '*' | '/' | 'COMPARE') => {
    const valA = parseFloat(numA);
    const valB = parseFloat(numB);

    if (isNaN(valA) || isNaN(valB)) {
      setResult('Vui lòng nhập đầy đủ số A và B');
      setRawNumberResult(null);
      setCurrentOpLabel('');
      return;
    }

    switch (op) {
      case '+': {
        const val = valA + valB;
        setRawNumberResult(val);
        setCurrentOpLabel('Tổng');
        setResult(`Tổng: ${val}`);
        break;
      }
      case '-': {
        const val = valA - valB;
        setRawNumberResult(val);
        setCurrentOpLabel('Hiệu');
        setResult(`Hiệu: ${val}`);
        break;
      }
      case '*': {
        const val = valA * valB;
        setRawNumberResult(val);
        setCurrentOpLabel('Tích');
        setResult(`Tích: ${val}`);
        break;
      }
      case '/': {
        if (valB === 0) {
          setResult('Thương: Không thể chia cho 0');
          setRawNumberResult(null);
          setCurrentOpLabel('');
        } else {
          const val = valA / valB;
          setRawNumberResult(val);
          setCurrentOpLabel('Thương');
          setResult(`Thương: ${val}`);
        }
        break;
      }
      case 'COMPARE':
        setRawNumberResult(null);
        setCurrentOpLabel('');
        if (valA > valB) {
          setResult(`So sánh: ${numA} > ${numB}`);
        } else if (valA < valB) {
          setResult(`So sánh: ${numA} < ${numB}`);
        } else {
          setResult(`So sánh: ${numA} = ${numB}`);
        }
        break;
    }
  };

  // Trigger calculation when inputs or selected operation changes
  useEffect(() => {
    handleOperation(selectedOp);
  }, [numA, numB, selectedOp]);

  // Custom Keyboard key press handler
  const handleKeyPress = (key: string) => {
    const currentVal = activeInput === 'A' ? numA : numB;
    const setVal = activeInput === 'A' ? setNumA : setNumB;

    if (key === 'C') {
      // Clear key
      setVal('');
    } else if (key === '.') {
      // Decimal point key - prevent multiple decimals
      if (!currentVal.includes('.')) {
        setVal(currentVal === '' ? '0.' : currentVal + '.');
      }
    } else if (key === '-') {
      // Negative sign key - toggle negative sign
      if (currentVal.startsWith('-')) {
        setVal(currentVal.substring(1));
      } else {
        setVal('-' + currentVal);
      }
    } else {
      // Numbers 0-9
      // If current value is '0', replace it unless we are entering a decimal
      if (currentVal === '0') {
        setVal(key);
      } else {
        setVal(currentVal + key);
      }
    }
  };

  // Delete last digit helper
  const handleDeleteDigit = (target: 'A' | 'B') => {
    if (target === 'A') {
      setNumA(prev => prev.slice(0, -1));
    } else {
      setNumB(prev => prev.slice(0, -1));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
          
          {/* Main Card */}
          <View style={styles.calculatorCard}>
            
            {/* Header Title */}
            <Text style={styles.title}>May tinh co ban</Text>
            
            {/* Input field A with active highlight & Delete button */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  activeInput === 'A' && styles.activeInput
                ]}
                value={numA}
                onFocus={() => setActiveInput('A')}
                placeholder="Nhập số A"
                placeholderTextColor="#999"
                showSoftInputOnFocus={false} // Disable native keyboard to use custom one
                caretHidden={false}
              />
              {numA.length > 0 && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteDigit('A')}
                  activeOpacity={0.6}
                >
                  <Text style={styles.deleteButtonText}>⌫</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Input field B with active highlight & Delete button */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  activeInput === 'B' && styles.activeInput
                ]}
                value={numB}
                onFocus={() => setActiveInput('B')}
                placeholder="Nhập số B"
                placeholderTextColor="#999"
                showSoftInputOnFocus={false} // Disable native keyboard to use custom one
                caretHidden={false}
              />
              {numB.length > 0 && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteDigit('B')}
                  activeOpacity={0.6}
                >
                  <Text style={styles.deleteButtonText}>⌫</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Operations Selector */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.opButton, selectedOp === '+' && styles.activeOpButton]}
                onPress={() => setSelectedOp('+')}
                activeOpacity={0.7}
              >
                <Text style={[styles.opButtonText, selectedOp === '+' && styles.activeOpButtonText]}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.opButton, selectedOp === '-' && styles.activeOpButton]}
                onPress={() => setSelectedOp('-')}
                activeOpacity={0.7}
              >
                <Text style={[styles.opButtonText, selectedOp === '-' && styles.activeOpButtonText]}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.opButton, selectedOp === '*' && styles.activeOpButton]}
                onPress={() => setSelectedOp('*')}
                activeOpacity={0.7}
              >
                <Text style={[styles.opButtonText, selectedOp === '*' && styles.activeOpButtonText]}>*</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.opButton, selectedOp === '/' && styles.activeOpButton]}
                onPress={() => setSelectedOp('/')}
                activeOpacity={0.7}
              >
                <Text style={[styles.opButtonText, selectedOp === '/' && styles.activeOpButtonText]}>/</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.compareButton, selectedOp === 'COMPARE' && styles.activeCompareButton]}
                onPress={() => setSelectedOp('COMPARE')}
                activeOpacity={0.7}
              >
                <Text style={[styles.compareButtonText, selectedOp === 'COMPARE' && styles.activeCompareButtonText]}>So sánh</Text>
              </TouchableOpacity>
            </View>
            
            {/* Result text */}
            <Text style={styles.resultText}>{renderResultText()}</Text>
            
            {/* Rounding Options Selector in Radio Button Format */}
            <View style={styles.roundSelectorContainer}>
              <Text style={styles.roundSelectorLabel}>Làm tròn kết quả:</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioButtonContainer}
                  onPress={() => setRoundOption('raw')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.radioCircle,
                    roundOption === 'raw' && styles.radioCircleActive
                  ]}>
                    {roundOption === 'raw' && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[
                    styles.radioLabel,
                    roundOption === 'raw' && styles.radioLabelActive
                  ]}>Mặc định</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioButtonContainer}
                  onPress={() => setRoundOption('2')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.radioCircle,
                    roundOption === '2' && styles.radioCircleActive
                  ]}>
                    {roundOption === '2' && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[
                    styles.radioLabel,
                    roundOption === '2' && styles.radioLabelActive
                  ]}>Lẻ 2 số</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioButtonContainer}
                  onPress={() => setRoundOption('integer')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.radioCircle,
                    roundOption === 'integer' && styles.radioCircleActive
                  ]}>
                    {roundOption === 'integer' && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[
                    styles.radioLabel,
                    roundOption === 'integer' && styles.radioLabelActive
                  ]}>Số nguyên</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Custom calendar display box */}
            <TouchableOpacity
              style={styles.calendarBox}
              onPress={() => setIsDatePickerVisible(true)}
              activeOpacity={0.7}
            >
              <FontAwesome name="calendar" size={18} color="#666" style={styles.calendarIcon} />
              <Text style={styles.calendarText}>{selectedDay}</Text>
            </TouchableOpacity>

          </View>
          
          {/* Custom Numeric Keypad at the bottom */}
          <View style={styles.keypadContainer}>
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('1')}>
                <Text style={styles.keyText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('2')}>
                <Text style={styles.keyText}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('3')}>
                <Text style={styles.keyText}>3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keySpecial} onPress={() => setSelectedOp('-')}>
                <Text style={styles.keyText}>-</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('4')}>
                <Text style={styles.keyText}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('5')}>
                <Text style={styles.keyText}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('6')}>
                <Text style={styles.keyText}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keySpecial} onPress={() => setSelectedOp('+')}>
                <Text style={styles.keyText}>+</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('7')}>
                <Text style={styles.keyText}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('8')}>
                <Text style={styles.keyText}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('9')}>
                <Text style={styles.keyText}>9</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keySpecial} onPress={() => setSelectedOp('*')}>
                <Text style={styles.keyText}>*</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.keyDanger} onPress={() => handleKeyPress('C')}>
                <Text style={styles.keyTextDanger}>C</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('0')}>
                <Text style={styles.keyText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('.')}>
                <Text style={styles.keyText}>.</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keySpecial} onPress={() => setSelectedOp('/')}>
                <Text style={styles.keyText}>/</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Custom calendar modal selector */}
      <Modal
        visible={isDatePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsDatePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn một ngày (Calendar)</Text>
            
            <FlatList
              data={daysArray}
              numColumns={5}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dayButton,
                    selectedDay === item && styles.selectedDayButton
                  ]}
                  onPress={() => {
                    setSelectedDay(item);
                    setIsDatePickerVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDay === item && styles.selectedDayButtonText
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.daysList}
            />
            
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsDatePickerVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
    </SafeAreaView>
  );
};

export default HelloState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  calculatorCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 55,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingLeft: 15,
    paddingRight: 45, // prevent text overlaying backspace
    fontSize: 20,
    color: '#333',
    backgroundColor: '#f8fafc',
  },
  activeInput: {
    borderColor: '#3b82f6',
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  deleteButton: {
    position: 'absolute',
    right: 12,
    height: 55,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginVertical: 15,
    textAlign: 'center',
  },
  
  // Math Operations button styles
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    marginBottom: 15,
    gap: 8,
  },
  opButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  activeOpButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  opButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#475569',
  },
  activeOpButtonText: {
    color: '#fff',
  },
  compareButton: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  activeCompareButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  compareButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#475569',
  },
  activeCompareButtonText: {
    color: '#fff',
  },

  // Rounding options radio styles
  roundSelectorContainer: {
    width: '100%',
    marginTop: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  roundSelectorLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 2,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 5,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  radioCircleActive: {
    borderColor: '#3b82f6',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  radioLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  radioLabelActive: {
    color: '#3b82f6',
  },

  calendarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#f1f5f9',
    marginTop: 5,
  },
  calendarIcon: {
    marginRight: 8,
  },
  calendarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#475569',
  },
  
  // Custom Keypad
  keypadContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 15,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    marginTop: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  key: {
    flex: 1,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keySpecial: {
    flex: 1,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyDanger: {
    flex: 1,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  keyTextDanger: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  
  // Modal selector styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  daysList: {
    paddingBottom: 10,
  },
  dayButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    backgroundColor: '#f8fafc',
  },
  selectedDayButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  dayButtonText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  selectedDayButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeModalButton: {
    marginTop: 15,
    backgroundColor: '#64748b',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
