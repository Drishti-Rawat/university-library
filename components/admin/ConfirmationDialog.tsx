'use client'
import React, { useState } from 'react'
import { AlertTriangle, Trash2, UserCog, Shield, X } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'warning' | 'approve'
  icon?: 'warning' | 'delete' | 'role' | 'shield' | 'custom'
  customIcon?: React.ReactNode
  isLoading?: boolean
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon = 'warning',
  customIcon,
  isLoading = false
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    if (customIcon) return customIcon
    
    switch (icon) {
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-white" />
      case 'delete':
        return <Trash2 className="w-8 h-8 text-white" />
      case 'role':
        return <UserCog className="w-8 h-8 text-white" />
      case 'shield':
        return <Shield className="w-8 h-8 text-white" />
      default:
        return <AlertTriangle className="w-8 h-8 text-white" />
    }
  }

  const getIconBackground = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-600'
      case 'warning':
        return 'bg-orange-500'
      case 'approve':
        return 'bg-green-500'
      default:
        return 'bg-blue-500'
    }
  }

  const getConfirmButtonStyle = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-600 hover:bg-red-700 text-white font-medium'
      case 'warning':
        return 'bg-orange-500 hover:bg-orange-600 text-white font-medium'
      case 'approve':
        return 'bg-green-500 hover:bg-green-600 text-white font-medium'
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white font-medium'
    }
  }

  return (
     <div 
      className="fixed inset-0 b backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 pt-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getIconBackground()}`}>
              {getIcon()}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
            {title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-center text-sm leading-relaxed mb-8">
            {description}
          </p>

          {/* Action Button */}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${getConfirmButtonStyle()}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog

// Usage Examples:

// For Delete User:
/*
<ConfirmationDialog
  isOpen={showDeleteDialog}
  onClose={() => setShowDeleteDialog(false)}
  onConfirm={() => handleDeleteUser(userId)}
  title="Delete User Account"
  description="Are you sure you want to delete this user account? This action cannot be undone and will permanently remove all user data."
  confirmText="Delete User"
  cancelText="Cancel"
  variant="destructive"
  icon="delete"
  isLoading={isDeleting}
/>
*/

// For Role Change:
/*
<ConfirmationDialog
  isOpen={showRoleDialog}
  onClose={() => setShowRoleDialog(false)}
  onConfirm={() => handleRoleChange(userId, newRole)}
  title="Change User Role"
  description={`Are you sure you want to change ${userName}'s role from ${currentRole} to ${newRole}? This will affect their access permissions.`}
  confirmText="Change Role"
  cancelText="Cancel"
  variant="default"
  icon="role"
  isLoading={isChangingRole}
/>
*/

// For Account Approval:
/*
<ConfirmationDialog
  isOpen={showApproveDialog}
  onClose={() => setShowApproveDialog(false)}
  onConfirm={() => handleApproveAccount(userId)}
  title="Approve Account Request"
  description="Are you sure you want to approve this account registration? The user will be notified and granted access to the system."
  confirmText="Approve Account"
  cancelText="Cancel"
  variant="default"
  icon="shield"
  isLoading={isApproving}
/>
*/

// For Account Denial:
/*
<ConfirmationDialog
  isOpen={showDenyDialog}
  onClose={() => setShowDenyDialog(false)}
  onConfirm={() => handleDenyAccount(userId)}
  title="Deny Account Request"
  description="Are you sure you want to deny this account registration? The user will be notified that their request was not approved."
  confirmText="Deny Request"
  cancelText="Cancel"
  variant="destructive"
  icon="warning"
  isLoading={isDenying}
/>
*/