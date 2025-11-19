import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const vipStyles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContainer: {
    flexGrow: 1,
  },

  // Section styles
  section: {
    padding: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Roboto',
  },

  vipCard: {
    height: '100%',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    justifyContent: 'space-between',
    position: 'relative',
    // Add subtle border for better definition
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // Web-style gradient backgrounds for each VIP level (will be dynamic)
    backgroundColor: '#2a2a2a',
    // Add shadow for depth
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  vipCardActive: {
    transform: [{ scale: 0.9 }],
    opacity: 1,
  },
  vipCardInactive: {
    transform: [{ scale: 0.85 }],
    opacity: 0.5,
  },
  vipCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  vipLevel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  vipStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  vipStatusCurrent: {
    color: '#4CAF50',
  },
  vipStatusTarget: {
    color: '#FF9800',
  },
  vipStatusLocked: {
    color: '#757575',
  },

  // Progress styles (enhanced to match web)
  progressSection: {
    marginBottom: 15,
    position: 'relative',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  progressBarContainer: {
    flex: 1,
    position: 'relative',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  progressPercentageOverlay: {
    position: 'absolute',
    top: -20,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'transparent',
  },
  progressPercentageText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  progressText: {
    color: '#ccc',
    fontSize: 12,
  },
  nextLevelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nextLevelCrown: {
    width: 16,
    height: 16,
    backgroundColor: '#F3B867', // Placeholder for crown
    borderRadius: 8,
  },
  nextLevelText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  depositRequirement: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  depositRequirementLarge: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    marginTop: 4,
  },

  // VIP Card Logo and Crown styles
  vipCardLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vipCardLogo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vipCardTitle: {
    fontSize: 18,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#fff',
  },
  crownContainer: {
    position: 'absolute',
    top: -10,
    right: 16,
    zIndex: 10,
    width: 80,
    height: 80,
    // Add shadow to make crown appear to float
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Android shadow
  },
  crownImage: {
    width: '100%',
    height: '100%',
  },

  // Progress Dots styles (enhanced to match web)
  progressDotsContainer: {
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDotsWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: 500,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDotsLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#3a3b3f',
    borderRadius: 2,
    zIndex: 1,
  },
  progressDotsRow: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#23242a',
    borderWidth: 2,
    borderColor: '#3a3b3f',
  },
  progressDotActive: {
    backgroundColor: '#e2b271',
    borderColor: '#e2b271',
    shadowColor: '#e2b271',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    transform: [{ scale: 1.2 }],
  },

  // Bonus Cards styles (enhanced to match web)
  bonusSection: {
    padding: 15,
  },
  bonusCardsRow: {
    flexDirection: 'column',
    gap: 10,
  },
  bonusCard: {
    height: 92,
    borderRadius: 8,
    padding: 16,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    // Default background - will be overridden with dynamic gradients
    backgroundColor: '#4CAF50',
    // Add shadow for depth
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bonusTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Roboto',
  },
  bonusPercentage: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'Roboto',
  },

  // VIP Levels Table styles
  tableSection: {
    backgroundColor: '#3f413f',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 10,
  },
  tableContainer: {
    backgroundColor: '#00000030',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableScrollView: {
    flexDirection: 'row',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    minWidth: screenWidth - 30, // Ensure minimum width for horizontal scroll
  },
  tableHeaderCell: {
    flex: 1,
    padding: 12,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: 80,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
    minWidth: screenWidth - 30,
  },
  tableCell: {
    flex: 1,
    padding: 12,
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    minWidth: 80,
  },

  // Terms and Conditions styles
  termsSection: {
    backgroundColor: '#3f413f',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginBottom: 20,
  },
  termsContent: {
    // Remove background since parent now has it
    padding: 0,
  },
  termsText: {
    color: '#ccc',
    fontSize: 12,
    lineHeight: 18,
  },

  // Complex Table Styles (matching web version)
  sectionSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    lineHeight: 16,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  complexTableBlock: {
    overflow: 'hidden',
    marginBottom: 16,
  },
  complexTableRow: {
    flexDirection: 'row',
  },
  complexTableLabelCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  complexTableLabelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'normal',
    textAlign: 'center',
    lineHeight: 12,
  },
  complexTableDataCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  complexTableHeaderContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipCrownPlaceholder: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  vipCrownText: {
    fontSize: 24,
  },
  complexTableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  complexTableDataText: {
    fontSize: 10,
    color: '#ffffff80',
    textAlign: 'center',
  },

  // Loading and Error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Authentication required styles
  authRequiredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  authRequiredTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  authRequiredText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
